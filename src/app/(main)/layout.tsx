import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
