"use client";

import { signOut } from "next-auth/react"

const SignOutButton = () => {
    return (
        <button className="text-blue-700 underline rounded-md" onClick={() => signOut({
            redirect: true,
            callbackUrl: `http://localhost:3000/`
        })}>
            Sign Out
        </button>
    )
}

export default SignOutButton;