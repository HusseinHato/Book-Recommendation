// import Link from "next/link";
// import { Suspense } from "react";
// import { Books } from "./_components/Books";
// import Loading from "./loading";
import { api } from "@/trpc/server";
import BookCard from "./_components/BookCard";
import Books from "./_components/Books";

// import { CreatePost } from "@/app/_components/create-post";
// import { getServerAuthSession } from "@/server/auth";

export default function Home() {
  // const book = await api.book.someBooks.query();

  return (
    <main className="text-white">
      <div className="container flex items-center justify-center">
        <Books />
      </div>
    </main>
  );
}

// async function Books() {
//   const page = 0;
//   const books = await api.book.someBooks.query({ page });

//   return (
//     <>
//       <ul className="flex flex-col space-y-2 mb-4">
//         {books.map((book, index) => {
//           return <BookCard ISBN={book.ISBN} key={index} />;
//         })}
//       </ul>
//     </>
//   );
// }
