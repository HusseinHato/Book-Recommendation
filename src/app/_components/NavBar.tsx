import Link from "next/link";
import React from "react";
import SignOutButton from "./SignOutButton";
import { getServerAuthSession } from "@/server/auth";

const NavBar = async () => {
  const session = await getServerAuthSession();

  console.log(session);

  return (
    <nav className="bg-[#2d2d2d] p-4 mb-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">OpenBook</div>
          <div className="flex gap-4">
            <Link href={"/"} className="text-white">
              Home
            </Link>
            {session?.user ? (
              <>
                <Link href={"/dashboard"} className="text-white">Dashboard</Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href={"/signin"} className="text-white">
                  Sign in
                </Link>
                <Link href={"/signup"} className="text-white">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
