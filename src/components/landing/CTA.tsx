import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignupDialog } from "./SignupDialog";

export const CTA = () => {
  const { openSignupDialog } = useSignupDialog();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-sage-50">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Achieve Your Goals?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Be among the first to experience our AI-powered accountability platform
          when we launch. Join our waitlist to stay updated!
        </p>
        <Button
          size="lg"
          className="bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
          onClick={openSignupDialog}
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};