import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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
});
