import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { create } from "zustand";

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

export const SignupDialog = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [excitement, setExcitement] = useState("");
  const { toast } = useToast();
  const { isOpen, closeSignupDialog } = useSignupDialog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log("Submitted:", { name, email, excitement });
    toast({
      title: "Thanks for signing up!",
      description: "We'll notify you as soon as Achievr launches.",
    });
    closeSignupDialog();
    setEmail("");
    setName("");
    setExcitement("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeSignupDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join the Waitlist</DialogTitle>
          <DialogDescription className="text-lg">
            Be among the first to experience Achievr when we launch!
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
              required
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
          <div className="space-y-2">
            <label htmlFor="excitement" className="text-sm font-medium">
              What excites you most about Achievr? (Optional)
            </label>
            <Textarea
              id="excitement"
              placeholder="Share what brings you to Achievr..."
              value={excitement}
              onChange={(e) => setExcitement(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-sage-500 hover:bg-sage-600 text-white"
          >
            Join Waitlist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};