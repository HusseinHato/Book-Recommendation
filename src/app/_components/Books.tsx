"use client";

import React from 'react';
// import { useState } from 'react';
import BookCard from './BookCard';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';

export default function Books() {
    // const [page, setPage] = useState(0);

    const { data, fetchNextPage, isFetchingNextPage, isFetching } = api.book.getBatch.useInfiniteQuery(
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
        <ul className='flex flex-col space-y-2 mb-4 items-center'>
            {data?.pages.map(page => page.items.map(
                (item, index) => <BookCard key={index} ISBN={item.ISBN} />
            ))}
        {isFetching && !isFetchingNextPage ? <p>Loading...</p> : 
        <Button onClick={() => {
            void fetchNextPage();
            // setPage((page) => page + 1);
        }}>Load More</Button>
        }
        </ul>
    </>
  )
}
