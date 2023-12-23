import { z } from "zod";

import * as tf from "@tensorflow/tfjs";

import {
  createTRPCRouter,
  protectedProcedure,
  // protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

interface Model {
  userBookMatrix: tf.Tensor2D;
  similarityMatrix: tf.Tensor2D;
  userIndexMap: Map<string, number>;
  bookIndexMap: Map<string, number>;
}

interface Interaction {
  id: number;
  User_ID: string;
  ISBN: string;
  Rating: number;
  // Add other interaction-related fields
}

function buildRecommendationModel( interactions: Interaction[]): Model {

  console.log(interactions);

  const userIndexMap = new Map(Array.from(new Set(interactions.map((interaction) => interaction.User_ID)))
  .map((user, index) => [user, index]));

  const bookIndexMap = new Map(Array.from(new Set(interactions.map((interaction) => interaction.ISBN)))
    .map((book, index) => [book, index]));

    console.log(userIndexMap);

  const numUsers = userIndexMap.size;
  const numBooks = bookIndexMap.size;

  console.log(numUsers)
  console.log(numBooks)

// Initialize userBookMatrix with zeros
const userBookMatrixData = Array.from({ length: numUsers }, () =>
  Array.from({ length: numBooks }, () => 0)
);

interactions.forEach((interaction) => {
  const userIndex = userIndexMap.get(interaction.User_ID)!;
  const bookIndex = bookIndexMap.get(interaction.ISBN)!;
  userBookMatrixData[userIndex][bookIndex] = interaction.Rating;
});

  console.log('Total entries in userBookMatrixData:', userBookMatrixData.length);
  console.log('Total entries in userBookMatrixData:', userBookMatrixData);

  const userBookMatrix = tf.tensor(userBookMatrixData, [numUsers, numBooks]);

  console.log('User Book Matrix Shape:', userBookMatrix.shape);
  console.log('Total elements in userBookMatrix:', userBookMatrix.size);

  // Check the shape of the userBookMatrix
  console.log('User Book Matrix Shape:', userBookMatrix.shape);

  const userBookMatrixTranspose = userBookMatrix.transpose();
console.log('userBookMatrix shape:', userBookMatrix.shape);
console.log('userBookMatrixTranspose shape:', userBookMatrixTranspose.shape);

const dotProduct = userBookMatrix.matMul(userBookMatrixTranspose);
console.log('dotProduct shape:', dotProduct.shape);

const norms1 = userBookMatrix.norm(2, 1);
const norms2 = userBookMatrixTranspose.norm(2, 0);
console.log('norms1 shape:', norms1.shape);
console.log('norms2 shape:', norms2.shape);

const similarityMatrix = dotProduct
  .div(norms1.mul(norms2).add(1e-6));
console.log('similarityMatrix shape:', similarityMatrix.shape);
console.log('similarityMatrix shape:', similarityMatrix.arraySync());

  return {
    userBookMatrix,
    similarityMatrix,
    userIndexMap,
    bookIndexMap,
  };
}

let model: Model;

export const bookRouter = createTRPCRouter({
  someBooks: publicProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.book.findMany({
        skip: input.page,
        take: 10,
      });
    }),

  getBook: publicProcedure
    .input(z.object({ ISBN: z.string() }))
    .query(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.book.findUnique({
        where: {
          ISBN: input.ISBN,
        },
      });
    }),

  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        // categoryId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.db.book.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { ISBN: cursor } : undefined,
        orderBy: {
          ISBN: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.ISBN;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        items,
        nextCursor,
      };
    }),

  trainmodel: publicProcedure.query(async ({ ctx }) => {
    const interactions = (await ctx.db.rating.findMany()) as Interaction[];

    model =  buildRecommendationModel( interactions);

    return "Model Trained";
  }),

  getRecommendation: protectedProcedure
    // .input(z.object({ id: z.string() }))
    .query(({ ctx }) => {
      const userIndex = model.userIndexMap.get(ctx.session.user.id);

      console.log(userIndex);

      // const ratings = await ctx.db.rating.findMany({
      //   where: {
      //     User_ID: ctx.session.user.id
      //   }
      // });

      // if(!ratings){
      //   return null
      // }

      if (userIndex === undefined || userIndex < 0 || userIndex >= model.similarityMatrix.shape[0]) {
        return null;
      }

      // Extract the row corresponding to the user from the similarity matrix
      const userSimilarities = model.similarityMatrix.slice([userIndex, 0], [1, model.similarityMatrix.shape[1]]);
      const userRatings = model.userBookMatrix.slice([userIndex, 0], [1, model.userBookMatrix.shape[1]]);

      const ratedBooks = userRatings.flatten().arraySync().map((rating, index) => {
        if (rating > 0) {
          return Array.from(model.bookIndexMap.keys())[index];
        }
        return null;
      }).filter(Boolean);

      // Get the indices of books sorted by similarity (descending order)
      const sortedIndices = tf.topk(userSimilarities, model.similarityMatrix.shape[1], true).indices;
      

      // Convert the tensor to a regular JavaScript array
      const topBookIndices = sortedIndices.arraySync()[0];

      console.log(topBookIndices);

      const filteredIndices = topBookIndices?.filter((index) => !ratedBooks.includes(Array.from(model.bookIndexMap.keys())[index]));

      // Map book indices back to ISBNs using bookIndexMap
      const topBookISBNs = filteredIndices?.slice(0, 4).map((index) => {
        return Array.from(model.bookIndexMap.keys())[index];
      });

      console.log(topBookISBNs);

      const recommendations = topBookISBNs?.map((isbn) => {
        return {
          ISBN: isbn,
          // Add other book information here
        };
      });

      console.log(recommendations)


      return recommendations;
    }),
});
