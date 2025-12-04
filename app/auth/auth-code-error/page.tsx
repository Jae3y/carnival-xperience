"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cx-deep via-cx-night to-background px-4 py-8 text-foreground">
      <div className="w-full max-w-md">
        <Card className="border-white/10 bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-2xl">Something went wrong</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your magic link or password reset request.
              This can happen if the link has expired or was already used.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Don&apos;t worry — you can safely request a new link and try again.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-left">
              <li>Make sure you opened the most recent email from CarnivalXperience.</li>
              <li>Try copying and pasting the full link into your browser.</li>
              <li>If the problem continues, request a new login or reset email.</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/forgot-password" className="w-full">
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Request a new reset link
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

