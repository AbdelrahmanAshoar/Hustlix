"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const freelancers = [
  {
    id: 1,
    name: "Alex Developer",
    title: "Senior Full Stack Engineer",
    tags: ["React", "Next.js", "Node.js"],
    rate: 85,
    rating: "4.9 (120 reviews)",
    avatarId: 11,
  },
  {
    id: 2,
    name: "Mina Designer",
    title: "UI/UX Product Designer",
    tags: ["Figma", "Sketch", "Branding"],
    rate: 75,
    rating: "4.8 (98 reviews)",
    avatarId: 12,
  },
  {
    id: 3,
    name: "Sara Marketer",
    title: "Growth Marketing Strategist",
    tags: ["SEO", "Content", "Ads"],
    rate: 65,
    rating: "4.7 (86 reviews)",
    avatarId: 13,
  },
];

type FeaturedFreelancersSectionProps = {
  onFreelancerClick: () => void;
  onViewAllTalent: () => void;
};

export default function FeaturedFreelancersSection({
  onFreelancerClick,
  onViewAllTalent,
}: FeaturedFreelancersSectionProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Top Rated Freelancers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {freelancers.map((freelancer) => (
            <Card
              key={freelancer.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={onFreelancerClick}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${freelancer.avatarId}`} />
                  <AvatarFallback>FL</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                  <CardDescription>{freelancer.title}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {freelancer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-lg">
                    ${freelancer.rate}
                    <span className="text-muted-foreground text-sm font-normal">/hr</span>
                  </span>
                  <span className="flex items-center text-amber-500 font-medium">
                    ★ {freelancer.rating}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" size={"lg"} className="rounded-full" >
            <Link href="/find-talent" className="text-primary " >
            View All Talent
          </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
