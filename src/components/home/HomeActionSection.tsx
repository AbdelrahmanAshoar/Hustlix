import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, Shield } from "lucide-react";

type HomeActionSectionProps = {
  isAuthenticated: boolean;
};

const authenticatedHighlights = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payments are protected with our escrow system",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description: "Your information is always secure and private",
  },
  {
    icon: AlertCircle,
    title: "24/7 Support",
    description: "Our support team is always here to help",
  },
];

export default function HomeActionSection({ isAuthenticated }: HomeActionSectionProps) {
  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of professionals already using Hustlix to find work or hire talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free to browse • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {authenticatedHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
