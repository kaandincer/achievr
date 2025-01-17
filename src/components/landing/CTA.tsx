import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignupDialog } from "./SignupDialog";

export const CTA = () => {
  const { openSignupDialog } = useSignupDialog();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#527fb8]">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#f9f8f6]">
          Ready to Transform Your Recovery?
        </h2>
        <p className="text-[#f9f8f6]/90 max-w-2xl mx-auto mb-8">
          Join our waitlist to be among the first runners to experience a new way of
          recovery that's both effective and rewarding.
        </p>
        <Button
          size="lg"
          className="bg-[#f9f8f6] hover:bg-white text-[#27425e] transition-all duration-300"
          onClick={openSignupDialog}
        >
          Join the Waitlist
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};
