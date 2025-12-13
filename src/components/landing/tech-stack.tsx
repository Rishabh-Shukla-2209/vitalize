import Image from "next/image";

export function TechStack() {
  return (
    <section id="tech-stack" className="w-full my-20 pt-5">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-zinc-700 dark:text-white tracking-tight mb-3">
          Tech Stack
        </h2>
        <p className="text-zinc-600 dark:text-gray-400">
          The modern full-stack toolkit. Fast, scalable, and fully typed.{" "}
        </p>
      </div>
      <div className="flex justify-center items-center gap-15 flex-wrap w-full px-10 mt-10">
        <Image
          src="/tech-icons/nextjs.svg"
          height={100}
          width={100}
          alt="Next dot JS Logo"
        />
        <Image
          src="/tech-icons/tailwindcss.svg"
          height={100}
          width={100}
          alt="Tailwind CSS Logo"
        />
        <Image
          src="/tech-icons/prisma.svg"
          height={100}
          width={100}
          alt=""
          aria-hidden="true"
          className="hidden dark:block"
        />
        <Image
          src="/tech-icons/prisma-light.svg"
          height={100}
          width={100}
          alt="Prisma Logo"
          className="block dark:hidden"
        />
        <Image
          src="/tech-icons/clerk.png"
          height={100}
          width={100}
          alt="Clerk Logo"
        />
        <Image
          src="/tech-icons/shadcnui.png"
          height={100}
          width={100}
          alt="ShadCN Logo"
        />
        <Image
          src="/tech-icons/typescript.svg"
          height={100}
          width={100}
          alt="TypeScript Logo"
        />
        <Image
          src="/tech-icons/supabase.svg"
          height={100}
          width={100}
          alt="Supabase Logo"
        />
        <Image
          src="/tech-icons/react.svg"
          height={100}
          width={100}
          alt="React Logo"
        />
        <Image
          src="/tech-icons/sentry.svg"
          height={100}
          width={100}
          alt="Sentry Logo"
          className="hidden dark:block"
        />
        <Image
          src="/tech-icons/sentry-light.svg"
          height={100}
          width={100}
          alt="Sentry Logo"
          className="block dark:hidden"
        />
        <Image
          src="/tech-icons/cloudinary.svg"
          height={100}
          width={100}
          alt="Cloudinary Logo"
        />
        <Image
          src="/tech-icons/pusher.svg"
          height={100}
          width={100}
          alt="Pusher Logo"
          className="hidden dark:block"
        />
        <Image
          src="/tech-icons/pusher-light.svg"
          height={100}
          width={100}
          alt="Pusher Logo"
          className="block dark:hidden"
        />
      </div>
    </section>
  );
}
