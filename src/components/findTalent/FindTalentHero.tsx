import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
type FindTalentHeroProps = {
  totalTalent: number;
};

export default function FindTalentHero({ totalTalent }: FindTalentHeroProps) {
  const { isAuthenticated } = useAuth();
  return (
    <section className="bg-primary/5 py-20">
      <div className="container mx-auto px-4 text-center">
        <Badge
          className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border-none "
          variant="outline"
        >
          Find Talent
        </Badge>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Discover top freelance professionals, fast.
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
          Search freelancers by skill, experience, hourly rate, and
          availability. Hire the best match for your project with confidence.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto text-left">
          <div className="rounded-3xl bg-white/80 p-6 shadow-sm border border-border">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Talent in network
            </p>
            <p className="text-3xl font-semibold">{totalTalent}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-6 shadow-sm border border-border">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Top categories
            </p>
            <p className="text-lg font-semibold">
              Development, Design, Marketing
            </p>
          </div>
          <div className="rounded-3xl bg-white/80 p-6 shadow-sm border border-border">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Ready to hire
            </p>
            <p className="text-lg font-semibold">
              Fast onboarding, verified talent
            </p>
          </div>
        </div>

        <div className="mt-10">
          {!isAuthenticated ? (
            <>
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/client">
                <Button size="lg" className="rounded-full px-8">
                  Post a Project
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
