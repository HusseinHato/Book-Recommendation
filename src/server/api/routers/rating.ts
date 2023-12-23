import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "@/server/api/trpc";

  import { z } from "zod";

  export const ratingRouter = createTRPCRouter({
    someBooks: publicProcedure
      .input(z.object({ page: z.number() }))
      .query(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        return ctx.db.book.findMany({
          skip: input.page,
          take: 10,
        });
      }),

  create: protectedProcedure
    .input(z.object({ ISBN: z.string(), rating: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const rate = await ctx.db.rating.findFirst({
        where: {
          ISBN: input.ISBN,
          User_ID: ctx.session.user.id,
        }
      })

      if (rate) {
        return ctx.db.rating.update({
          where: {
            id: rate.id
          },
          data: {
            Rating: input.rating,
          }
        })
      }

      // console.log(ctx.session.user);

      return ctx.db.rating.create({
        data: {
          ISBN: input.ISBN,
          User_ID: ctx.session.user.id,
          Rating: input.rating,
        },
      });
    }),

    // getAllrating: publicProcedure
    // .input(z.object({ ISBN: z.string() }))
    // .query(async ({input, ctx}) => {
    //   return ctx.db.rating.findMany({
    //     where: {
    //       ISBN: input.ISBN
    //     }
    //   })
    // }),

    getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
        cursor: z.number().nullish(),
        skip: z.number().optional(),
        ISBN: z.string()
        // categoryId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor, ISBN } = input;
      const items = await ctx.db.rating.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          ISBN: ISBN
        }
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        items,
        nextCursor,
      };
    }),

    getBatchWithBook: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
        cursor: z.number().nullish(),
        skip: z.number().optional(),
        // categoryId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.db.rating.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          User_ID: ctx.session?.user.id
        },
        include: {
          book: true
        }
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        items,
        nextCursor,
      };
    }),

    getRating: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      
      return ctx.db.rating.findFirst({
        where: {
          id: input.id
        },
        include: {
          user: true
        }
      });
    }),
  
    // getBook: publicProcedure
    //   .input(z.object({ ISBN: z.string() }))
    //   .query(async ({ ctx, input }) => {
  
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
        
    //     return ctx.db.book.findUnique({
    //       where: {
    //         ISBN: input.ISBN,
    //       },
    //     });
    //   }),
  
    // getBatch: publicProcedure
    //   .input(
    //     z.object({
    //       limit: z.number(),
    //       // cursor is a reference to the last item in the previous batch
    //       // it's used to fetch the next batch
    //       cursor: z.string().nullish(),
    //       skip: z.number().optional(),
    //       // categoryId: z.number().optional(),
    //     }),
    //   )
    //   .query(async ({ ctx, input }) => {
    //     const { limit, skip, cursor } = input;
    //     const items = await ctx.db.book.findMany({
    //       take: limit + 1,
    //       skip: skip,
    //       cursor: cursor ? { ISBN: cursor } : undefined,
    //       orderBy: {
    //         ISBN: "asc",
    //       },
    //     });
    //     let nextCursor: typeof cursor | undefined = undefined;
    //     if (items.length > limit) {
    //       const nextItem = items.pop(); // return the last item from the array
    //       nextCursor = nextItem?.ISBN;
    //     }
  
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
  
    //     return {
    //       items,
    //       nextCursor,
    //     };
    //   }),
  });