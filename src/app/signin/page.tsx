import React from 'react'
import SignInForm from '../_components/SignInForm'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation';

export default async function SignIn() {

  const session = await getServerAuthSession();

  if(session) {
    redirect("/")
  }

  return (
    <SignInForm />
  )
}
