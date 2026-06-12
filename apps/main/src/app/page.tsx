import { Navbar } from "@/components/navbar";
import { HomeSections } from "@/components/home-sections";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HomeSections />
    </main>
  );
}
