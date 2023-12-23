import { createTRPCRouter } from "@/server/api/trpc";
import { bookRouter } from "./routers/book";
import { userRouter } from "./routers/user";
import { ratingRouter } from "./routers/rating";
// import { postRouter } from "./routers/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  book: bookRouter,
  user: userRouter,
  rating: ratingRouter
  // post: postRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
