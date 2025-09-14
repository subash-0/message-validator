"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function HeroSection() {
  const { data: session } = useSession();
  const name = session?.user.name;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {session && (
          <div className="text-center mb-4">
            {" "}
            <h1 className="text-lg md:text-2xl font-semibold">
              Hello , {name}
            </h1>
            <Button className="my-2">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        )}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
            Connect Anonymously.{" "}
            <span className="text-primary">Share Freely.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
            Create your unique link and receive anonymous messages from anyone.
            Share your thoughts, get honest feedback, and connect without
            barriers.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/sign-in">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Your Link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                100% Anonymous
              </h3>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Complete privacy for both senders and receivers
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                Instant Setup
              </h3>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Get your shareable link in seconds
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3">
                <Users className="h-6 w-6 text-black" />
              </div>
              <h3 className="mt-4 font-semibold text-black">
                Share Anywhere
              </h3>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Social media, bio links, or direct messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
