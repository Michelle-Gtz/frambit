"use client";

import Navbar from "@/modules/auth/actions/home/components/navBar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProjectForm from "@/modules/auth/actions/home/components/projectForm";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO WRAPPER */}
      <main className="min-h-screen flex items-center justify-center pt-24">
        <div className="space-y-2 md:space-y-3">
          <section className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <Image
              src="/frambit.png"
              alt="logo"
              width={150}
              height={150}
              className="shrink-0 invert dark:invert-0"
            />

            <h1 className="text-2xl md:text-5xl font-bold">
              Build Something with Frambit
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-center">
              Create apps and websites with the help of AI
            </p>
            <div className="max-w-3xl w-full">
              {/* Project Chat Input */}
              <ProjectForm />
            </div>
          </section>

          {/* SIGNED IN CONTENT */}
          <SignedIn>
            <div className="mt-12 flex flex-col items-center gap-4">
              <Button>Test</Button>
              <UserButton />
            </div>
          </SignedIn>

          {/* SIGNED OUT → intentionally empty */}
          <SignedOut>
            <div />
          </SignedOut>
        </div>
      </main>
    </>
  );
}
