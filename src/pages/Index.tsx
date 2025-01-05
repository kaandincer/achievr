import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
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
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Index;