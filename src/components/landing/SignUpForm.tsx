import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you would typically send this to your backend
    // For now, we'll just show a success message
    toast({
      title: "Thanks for signing up!",
      description: "We'll notify you when DailyWinz launches.",
      duration: 5000,
    });

    setName("");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="bg-white/80 backdrop-blur-sm"
      />
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-white/80 backdrop-blur-sm"
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
      >
        Join the Waitlist
      </Button>
    </form>
  );
};