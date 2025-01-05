import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "./SignUpForm";

export const Hero = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sage-600">
          DailyWinz
        </h1>
      </div>
      <section className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Transform Your Goals into{" "}
              <span className="text-sage-600">Achievements</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI-powered accountability partner that helps you stay focused,
              track progress, and achieve your goals with precision and purpose.
            </p>
          </div>
          <SignUpForm />
          <p className="text-sm text-gray-500">
            Join our early access list and be the first to know when we launch!
          </p>
        </div>
      </section>
    </div>
  );
};