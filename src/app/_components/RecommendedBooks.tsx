import React from "react";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import BookCard from "./BookCard";

export default async function RecommendedBooks() {
  const session = await getServerAuthSession();

  console.log(session);

  if (!session) {
    return null
  }

  const train = await api.book.trainmodel.query();

  console.log(train);

  const recommended = await api.book.getRecommendation.query();

  console.log(recommended);

  return (
    <>
      {recommended ? (
        <>
        <h3 className="text-3xl text-white">Recommended For You</h3>
        <ul className="mb-4 grid grid-cols-2 gap-x-3 gap-y-3">
          {recommended.slice(0, 2).map((rec, index) => (
            <BookCard key={index} ISBN={rec.ISBN!} />
          ))}
        </ul>
        </>
      ) : null}
    </>
  );
}
