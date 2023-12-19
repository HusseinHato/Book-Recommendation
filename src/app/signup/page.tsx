import React from 'react'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation';
import SignUpForm from '../_components/SignUpForm';

export default async function SignUp() {

  const session = await getServerAuthSession();

  if(session) {
    redirect("/")
  }

  return (
    <SignUpForm />
  )
}
