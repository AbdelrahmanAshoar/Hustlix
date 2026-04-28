"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intendedAction: { type: "hire" | "work" } | null;
  onCreateAccount: () => void;
  onSignIn: () => void;
};

export default function AuthDialog({
  open,
  onOpenChange,
  intendedAction,
  onCreateAccount,
  onSignIn,
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {intendedAction?.type === "hire" ? "Hire Talent" : "Find Work"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Join Hustlix to connect with professionals worldwide
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              {intendedAction?.type === "hire"
                ? "Create an account to browse top talent, post projects, and hire the best freelancers for your business needs."
                : "Sign up to access thousands of projects, apply for jobs, and start your freelance career today."}
            </p>
          </div>

          <div className="space-y-2">
            <Button className="w-full rounded-full" size="lg" onClick={onCreateAccount}>
              Create Free Account
            </Button>
            <Button variant="outline" className="w-full rounded-full" onClick={onSignIn}>
              Sign In to Existing Account
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Benefits</span>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Access to 10,000+ freelancers
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Secure payment protection
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              24/7 customer support
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              No upfront fees
            </li>
          </ul>
        </div>

        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-muted-foreground text-center">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
