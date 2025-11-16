import type { Metadata } from "next";
import { spline_sans } from "./fonts/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "VitalAIze",
  description:
    "Crush your fitness goals with AI-personalized plans, real-time tracking, and a supportive community that grows with you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        cssLayerName: "clerk",
      }}
    >
      <html lang="en">
        <body className={`${spline_sans.className} antialiased`}>
          <ReactQueryProvider>
            {children}
            <Toaster position="top-right"/>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
