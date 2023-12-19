import { z } from "zod";
import { db } from "@/server/db";
import bcrypt from "bcrypt";


import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const getUserByEmail = async (userEmail: string) => {
  const user = await db.user.findUnique({
    where: {
      email: userEmail
    }
  })

  if(!user){
    return null
  }

  return user
}
 
export const userRouter = createTRPCRouter({
  userAll: protectedProcedure.query(async () => {

    const users = await db.user.findMany();

    return users;
  }),

  createUser: publicProcedure.input(
    z.object({
      username: z.string(),
      email: z.string(),
      password: z.string()
    })
  ).mutation(async (opts) => {
    const { input } = opts;

    const userEmail = await getUserByEmail(input.email)
    if(userEmail){
      return null;
    }

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await db.user.create({
      data: {
        name: input.username,
        email: input.email,
        password: hashed
      }
    });

    return user;
  })
});