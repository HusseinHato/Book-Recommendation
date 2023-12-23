"use client";

import React from 'react';
// import { useState } from 'react';
// import BookCard from './BookCard';
import RatingCard from './RatingCard';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';

type RatingsProps = {
  ISBN: string,
}

export default function Ratings({ ISBN }: RatingsProps) {
    // const [page, setPage] = useState(0);

    const { data, fetchNextPage, isFetchingNextPage, isFetching } = api.rating.getBatch.useInfiniteQuery(
        {
          limit: 2,
          ISBN: ISBN
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      );

    //   console.log(data?.pages);
    // const toShow = data?.pages[page]?.items;
    // console.log(toShow);
    // console.log(page);



  return (
    <>
        <ul className='grid grid-cols-2 mb-4 gap-x-3 gap-y-3'>
            {data?.pages.map(page => page.items.map(
                (item, index) => <RatingCard key={index} id={item.id} />
            ))}
        {isFetching && !isFetchingNextPage ? <p className='col-span-2'>Loading...</p> : 
        <Button className='col-span-2' onClick={() => {
            void fetchNextPage();
            // setPage((page) => page + 1);
        }}>Load More</Button>
        }
        </ul>
    </>
  )
}
