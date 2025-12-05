"use client";

import Link from "next/link";

export default function InternalServerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-2">500</h1>
      <h2 className="text-2xl font-semibold mb-4">Internal Server Error</h2>

      <p className="text-center max-w-md mb-8 text-gray-600 dark:text-gray-300">
        Something went wrong on our end. Please try again later.
      </p>

      <Link
        href="/"
        className="rounded-md px-6 py-2 font-semibold text-zinc-800"
        style={{ backgroundColor: "#38e07b" }}
      >
        Go Home
      </Link>
    </div>
  );
}
