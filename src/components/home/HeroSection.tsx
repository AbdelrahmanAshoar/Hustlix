"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, TrendingUp } from "lucide-react";

type HeroSectionProps = {
  onSearch: (query: string) => void;
};

const heroCopy = {
  hire: {
    title: "Stop guessing. Start hiring with confidence",
    description:
      "Make better hiring decisions with real skill evaluation and data-driven insights.",
    icon: Briefcase,
  },
  work: {
    title: "Stop guessing. Start building a stronger career path",
    description:
      "Improve your profile, align your skills with market needs, and grow your career with confidence.",
    icon: TrendingUp,
  },
};

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [mode, setMode] = useState<"hire" | "work">("hire");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === "hire" ? "work" : "hire"));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const currentCopy = heroCopy[mode];
  const Icon = currentCopy.icon;

  return (
    <section className="bg-primary/5 py-20 lg:py-20">
      <div className="container mx-auto text-center">
        <Badge
          className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border-none"
          variant="outline"
        >
          The #1 Workspace for Professionals
        </Badge>

        <div className="relative min-h-[320px] md:min-h-[360px] flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 32, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full"
            >
              <div className="pointer-events-none absolute right-[-80px] top-1/2 hidden -translate-y-1/2 md:block">
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.55, 0.75, 0.55],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-[320px] w-[320px] rounded-full bg-primary/30 blur-3xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[190px] w-[190px] rounded-full border border-white/30 bg-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-center">
                    <Icon className="h-20 w-20 text-primary/85" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:text-left">
                <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
                  {currentCopy.title}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-2xl md:mx-0 mx-auto">
                  {currentCopy.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-12 max-w-lg lg:max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-2 border">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center flex-1 bg-transparent px-2">
              <Search className="ml-2 h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="What service are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-12 px-3 bg-transparent outline-none min-w-0"
              />
            </div>

            <Button
              className="w-full sm:w-auto h-12 px-6 rounded-xl"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
