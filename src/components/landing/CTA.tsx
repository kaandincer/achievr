import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignupDialog } from "./SignupDialog";
import { useState } from "react";

export const CTA = () => {
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-sage-50">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Achieve Your Goals?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of successful individuals who have transformed their lives
          with our AI-powered accountability platform.
        </p>
        <Button
          size="lg"
          className="bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
          onClick={() => setShowSignupDialog(true)}
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <SignupDialog
        open={showSignupDialog}
        onOpenChange={setShowSignupDialog}
      />
    </section>
  );
};