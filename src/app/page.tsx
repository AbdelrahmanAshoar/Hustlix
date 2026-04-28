// app/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import AuthDialog from "@/components/home/AuthDialog";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedFreelancersSection from "@/components/home/FeaturedFreelancersSection";
import HeroSection from "@/components/home/HeroSection";
import HomeActionSection from "@/components/home/HomeActionSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";

type IntendedAction = {
  type: "hire" | "work";
};

export default function Home() {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [intendedAction, setIntendedAction] = useState<IntendedAction | null>(null);

  const openAuthDialog = (type: "hire" | "work") => {
    setIntendedAction({ type });
    setShowAuthDialog(true);
  };

  const handleProtectedAction = (action: "hire" | "work") => {
    if (!isAuthenticated) {
      openAuthDialog(action);
      return;
    }

    if (action === "hire") {
      if (userRole === "Client") {
        router.push("/freelancers");
      } else if (userRole === "Freelancer") {
        toast.info("Looking for talent?", {
          description:
            "As a freelancer, you might want to find work instead. Check out available projects!",
          action: {
            label: "Find Work",
            onClick: () => router.push("/projects"),
          },
          duration: 5000,
        });
      } else {
        router.push("/freelancers");
      }
    } else {
      if (userRole === "Freelancer") {
        router.push("/projects");
      } else if (userRole === "Client") {
        toast.info("Looking for work?", {
          description:
            "As a client, you might want to hire talent instead. Browse our freelancers!",
          action: {
            label: "Hire Talent",
            onClick: () => router.push("/freelancers"),
          },
          duration: 5000,
        });
      } else {
        router.push("/projects");
      }
    }
  };

  const handleSearch = (query: string) => {
    if (!isAuthenticated) {
      openAuthDialog("hire");
      return;
    }

    if (!query.trim()) {
      toast.error("Please enter a search term", {
        description: "What service are you looking for?",
      });
      return;
    }

    toast.success("Searching...", {
      description: `Finding results for "${query}"`,
    });
  };

  const handleCategoryClick = (category: string) => {
    if (!isAuthenticated) {
      openAuthDialog("work");
      return;
    }

    toast.info(category, {
      description: `${category} services coming soon!`,
    });
  };

  const handleFreelancerClick = () => {
    if (!isAuthenticated) {
      openAuthDialog("hire");
      return;
    }

    toast.info("Coming Soon", {
      description: "View full profile feature is coming soon!",
    });
  };

  const handleAuthRedirect = () => {
    setShowAuthDialog(false);
    if (intendedAction) {
      router.push("/auth/register");
    }
  };

  const handleLoginRedirect = () => {
    setShowAuthDialog(false);
    if (intendedAction) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onSearch={handleSearch} />
      <CategoriesSection onCategoryClick={handleCategoryClick} />
      <FeaturedFreelancersSection
        onFreelancerClick={handleFreelancerClick}
        onViewAllTalent={() => handleProtectedAction("hire")}
      />
      <HowItWorksSection />
      <HomeActionSection isAuthenticated={isAuthenticated} />
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        intendedAction={intendedAction}
        onCreateAccount={handleAuthRedirect}
        onSignIn={handleLoginRedirect}
      />
    </div>
  );
}
