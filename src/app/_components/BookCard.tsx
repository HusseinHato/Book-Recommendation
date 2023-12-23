"use client";

import React from "react";
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

import { api } from "@/trpc/react";

import Link from "next/link";

type CardProps = {
    ISBN: string,
  }

export default function BookCard({ ISBN }: CardProps) {
  const { data, isLoading } = api.book.getBook.useQuery({ ISBN });

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="w-full h-8" /> : data?.Book_Title}
        </CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="w-full h-6" /> : data?.Year_Of_Publication}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="w-full h-[500px] mb-2" /> : <img src={data?.Image_URL_L} alt={data?.Book_Title + "_image"} width={500} height={500}/>}
        {isLoading ? <Skeleton className="w-full h-6 mb-2" /> : <p>ISBN : {data?.ISBN}</p>}
        {isLoading ? <Skeleton className="w-full h-6" /> : <p>Publisher : {data?.Publisher}</p>}
      </CardContent>
      <CardFooter>
      {isLoading ? <Skeleton className="w-full h-6" /> : 
      <Link href={`/book/${data?.ISBN}`}>
        <Button>More</Button>
      </Link>
      }
      </CardFooter>
    </Card>
  );
}
