import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface SignupDialogStore {
  isOpen: boolean;
  openSignupDialog: () => void;
  closeSignupDialog: () => void;
}

export const useSignupDialog = create<SignupDialogStore>((set) => ({
  isOpen: false,
  openSignupDialog: () => set({ isOpen: true }),
  closeSignupDialog: () => set({ isOpen: false }),
}));

const motivationOptions = [
  { id: "cash-rewards", label: "Cash Rewards" },
  { id: "gamification", label: "Gamification" },
  { id: "ai-routines", label: "Shorter, efficient, and personalized routines through AI" },
  { id: "social-community", label: "Social community (online group stretches)" },
  { id: "progress-tracking", label: "Tracking progress and recovery levels" },
];

export const SignupDialog = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isOpen, closeSignupDialog } = useSignupDialog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('signups')
        .insert([
          { 
            Name: name,
            Email: email,
            motivation: selectedMotivations
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thanks for signing up!",
        description: "We'll notify you as soon as Plio launches.",
      });
      
      closeSignupDialog();
      setEmail("");
      setName("");
      setSelectedMotivations([]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeSignupDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join the Waitlist</DialogTitle>
          <DialogDescription className="text-lg">
            Be among the first runners to experience Plio when we launch!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">
              What would motivate you to stretch and keep up with recovery?
            </label>
            <div className="space-y-2">
              {motivationOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedMotivations.includes(option.label)}
                    onCheckedChange={(checked) => {
                      setSelectedMotivations(prev =>
                        checked
                          ? [...prev, option.label]
                          : prev.filter(item => item !== option.label)
                      );
                    }}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#527fb8] hover:bg-[#27425e] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Join Waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};