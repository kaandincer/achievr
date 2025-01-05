import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { About } from "@/components/landing/About";
import { CTA } from "@/components/landing/CTA";
import { Navbar } from "@/components/landing/Navbar";
import { SignupDialog } from "@/components/landing/SignupDialog";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SignupDialog />
      <Hero />
      <Features />
      <About />
      <CTA />
    </div>
  );
};

export default Index;