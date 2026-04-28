"use client";

import {
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Filter,
  Activity,
  Shield,
  Languages,
  Cloud,
} from "lucide-react";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
const features = [
  {
    title: "AI Skill Analysis",
    desc: "Analyze freelancer profiles to extract skills and measure real compatibility.",
    icon: Brain,
  },
  {
    title: "Accurate Matching",
    desc: "Match freelancers to projects based on real skills, not keywords.",
    icon: Target,
  },
  {
    title: "Profile Improvement",
    desc: "Get smart suggestions to improve your profile.",
    icon: TrendingUp,
  },
  {
    title: "Client Insights",
    desc: "See proposal stats and market pricing before deciding.",
    icon: BarChart3,
  },
  {
    title: "Proposal Filtering",
    desc: "Filter by budget, experience, delivery time, and rating.",
    icon: Filter,
  },
  {
    title: "Project Tracking",
    desc: "Track milestones, deadlines, and progress in real-time.",
    icon: Activity,
  },
  {
    title: "Secure Payments",
    desc: "Protected payments using PayPal & escrow system.",
    icon: Shield,
  },
  {
    title: "AI Translation",
    desc: "Communicate easily with real-time translation.",
    icon: Languages,
  },
  {
    title: "Cloud Storage",
    desc: "Manage files securely with cloud storage.",
    icon: Cloud,
  },
];

export default function WhyHustlix() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 p-1 px-4 bg-primary/10 hover:bg-primary/20  text-primary border-none">
            Why Hustlix?
          </Badge>

          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            Built with{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">AI</span>

              {/* Glow effect */}
              <span className="absolute inset-0 blur-xl bg-primary/30 rounded-full animate-pulse"></span>
            </span>{" "}
            for smarter freelancing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Hustlix analyzes skills, evaluates profiles, and matches freelancers
            with jobs based on real compatibility — not guesswork.
          </motion.p>

          {isAuthenticated ? (
            <></>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow-lg hover:scale-105 transition"
                >
                  Get Started
                </Button>
              </Link>

              <Link href="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 hover:scale-105 transition"
                >
                  Find Work
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-14">
            What Makes Hustlix Different
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className="
                      group cursor-pointer
                      border border-transparent
                      hover:border-primary/40
                      hover:shadow-2xl
                      transition-all duration-300
                      hover:-translate-y-2
                    "
                  >
                    <CardContent className="p-6 text-center">
                      {/* Icon */}
                      <div
                        className="
                        w-14 h-14 mx-auto mb-4
                        bg-primary/10 rounded-full
                        flex items-center justify-center
                        group-hover:scale-125
                        group-hover:rotate-6
                        transition-all duration-300
                      "
                      >
                        <Icon className="text-primary w-6 h-6" />
                      </div>

                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition">
                        {feature.title}
                      </h3>

                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6"
          >
            Not Just Another Platform
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Traditional platforms rely on keyword matching. Hustlix uses{" "}
            <span className="text-primary font-semibold">
              AI-driven analysis
            </span>{" "}
            to align real skills with real job needs.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              Start smarter with Hustlix
            </h2>

            <p className="text-muted-foreground mb-8">
              Improve your profile, find better projects, and hire smarter.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow hover:scale-105 transition"
                >
                  Create Account
                </Button>
              </Link>

              <Link href="/find-talent">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 hover:scale-105 transition"
                >
                  Explore Talent
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
