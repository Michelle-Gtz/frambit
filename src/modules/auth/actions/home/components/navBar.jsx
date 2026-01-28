"use client";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent p-4">
      <div className="flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/frambit.png"
            alt="logo"
            width={92}
            height={92}
            className="shrink-0 invert dark:invert-0"
          />
        </Link>

        <SignedOut>
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button size="sm">Register</Button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
