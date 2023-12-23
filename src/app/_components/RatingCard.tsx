"use client";

import React from "react";
import {
  Card,
//   CardContent,
  CardDescription,
//   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/trpc/react";

type CardProps = {
    id: number,
  }

export default function RatingCard({ id }: CardProps) {
  const { data, isLoading } = api.rating.getRating.useQuery({ id });

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="w-full h-8" /> : 'Name : ' + data?.user?.name}
        </CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="w-full h-6" /> : "Rating : " + data?.Rating + " Star"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
