"use client" 

import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { FileQuestion, MoveLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 dark:bg-zinc-950">
      <div className="flex w-full max-w-md flex-col items-center text-center rounded-2xl bg-zinc-100 p-8 shadow-sm dark:bg-sage-500 md:p-12">
        
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm dark:bg-sage-400">
          <FileQuestion className="h-10 w-10 text-zinc-500 dark:text-zinc-200" />
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Page Not Found
        </h1>
        
        <p className="mb-8 text-zinc-500 dark:text-zinc-200">
          The page you are looking for doesn&apos;t exist or has been moved. 
          Check the URL or head back to the dashboard.
        </p>

        <div className="flex w-full flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/">
              Return Home
            </Link>
          </Button>
          
          {/* 3. Use onClick with router.back() instead of Link */}
          <Button 
            variant="ghost" 
            className="w-full text-zinc-600 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-sage-400"
            onClick={() => router.back()}
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}