"use client";

import { api } from "@/trpc/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import Ratings from "@/app/_components/Ratings";

export default function Page({ params }: { params: { ISBN: string } }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const session = useSession();
  const utils = api.useUtils();

  console.log(session);


  // console.log(rating);

  const { data, isLoading } = api.book.getBook.useQuery({ ISBN: params.ISBN });

  const createRating = api.rating.create.useMutation({
    onSuccess: async () => {
      router.refresh();
      await utils.rating.getBatch.invalidate();
      await utils.rating.getRating.invalidate();
    },
  });

  console.log(data);

  return (
    <div className="container">
      <Card className="mb-4 w-full">
        <CardHeader>
          <CardTitle>
            {isLoading ? <Skeleton className="h-8 w-full" /> : data?.Book_Title}
          </CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              data?.Year_Of_Publication
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2">
          <div>
            {isLoading ? (
              <Skeleton className="mb-2 h-[500px] w-full" />
            ) : (
              <img
                src={data?.Image_URL_L}
                alt={data?.Book_Title + "_image"}
                width={500}
                height={500}
              />
            )}
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="mb-2 h-6 w-full" />
            ) : (
              <p>ISBN : {data?.ISBN}</p>
            )}
            {isLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <p>Author : {data?.Book_Author}</p>
            )}
            {isLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <p>Publisher : {data?.Publisher}</p>
            )}
          </div>
        </CardContent>
        {/* <CardFooter>
          {isLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : (
            <Link href={`/`}>
              <Button>Rate</Button>
            </Link>
          )}
        </CardFooter> */}
      </Card>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRating.mutate({ rating: rating, ISBN: params.ISBN });
          }}
          className="flex flex-col items-center gap-2"
        >
          <h3 className="text-2xl text-white">Rate</h3>
          {session.data ? (
            <>
              <Select onValueChange={(value) => setRating(parseInt(value))} value={`${rating}`}>
                <SelectTrigger className="mb-2 w-[180px]">
                  <SelectValue placeholder="Rate the book" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Star</SelectLabel>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Star</SelectItem>
                    <SelectItem value="3">3 Star</SelectItem>
                    <SelectItem value="4">4 Star</SelectItem>
                    <SelectItem value="5">5 Star</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                disabled={createRating.isLoading}
                className="mb-4 w-[180px]"
              >
                {createRating.isLoading ? "Submitting..." : "Submit"}
              </Button>
            </>
          ) : (
            <Link href={"/signin"}>
              <Button>Please Sign in First</Button>
            </Link>
          )}
        </form>
      </div>
      <div>
        <h3 className="text-2xl text-white text-center mb-4">All Ratings</h3>
        <div>
            <Ratings ISBN={params.ISBN} />
        </div>
      </div>
    </div>
  );
}
