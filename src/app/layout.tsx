import type { Metadata } from "next";
import "./globals.css";
import { spline_sans } from "@/ui/fonts";

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
    <html lang="en">
      <body
        className={`${spline_sans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
