import React from 'react';
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const session = await getServerAuthSession();

    if(!session) {
        redirect("/")
      }

  return (
    <div className="text-white text-3xl">Authenticated</div>
  )
}
