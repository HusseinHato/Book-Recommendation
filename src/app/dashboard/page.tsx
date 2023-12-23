import React from 'react';
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation';
import AllUserRatingBook from '../_components/allUserRatingBook';
import { api } from '@/trpc/server';

export default async function Dashboard() {
    const session = await getServerAuthSession();

    if(!session) {
        redirect("/")
      }

      const train = await api.book.trainmodel.query();

      console.log(train);

    const recommended = await api.book.getRecommendation.query();

    console.log(recommended);

  return (
    <div className="container">
      <h3 className='text-white text-3xl mt-4 mb-4'>Your Ratings</h3>
      <div>
        <AllUserRatingBook />
      </div>
    </div>
  )
}
