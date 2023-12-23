"use client";

import React from 'react';
// import { useState } from 'react';
// import BookCard from './BookCard';
import RatingCard from './RatingCard';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import BookCard from './BookCard';

export default function AllUserRatingBook() {
    // const [page, setPage] = useState(0);

    const { data, fetchNextPage, isFetchingNextPage, isFetching } = api.rating.getBatchWithBook.useInfiniteQuery(
        {
          limit: 4,
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
                (item, index) => 
                <div className='grid grid-cols-1' key={index}>
                    <BookCard ISBN={item.ISBN} />
                    <RatingCard id={item.id} />
                </div>
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
