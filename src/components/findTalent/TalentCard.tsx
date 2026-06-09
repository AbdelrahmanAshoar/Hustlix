"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import type { TalentProfile } from "@/services/client/getFreelancers";

type TalentCardProps = {
  talent: TalentProfile;
  onViewProfile?: (id: number) => void;
};

export default function TalentCard({ talent, onViewProfile }: TalentCardProps) {
  return (
    <Card className="rounded-3xl border border-border shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border border-primary/20">
            <AvatarImage src={normalizeImageUrl(talent.profilePictureUrl)} />
            <AvatarFallback>{talent.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{talent.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">{talent.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {talent.skills.slice(0, 4).map((skill) => (
            <Badge key={skill.id} variant="secondary">
              {skill.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Rate</p>
            <p className="font-semibold">{talent.hourlyRate ? `$${talent.hourlyRate}/hr` : "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="font-semibold">{talent.experienceLevel || "Not set"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500" /> {talent.rating.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> {talent.completedProjects} projects
          </span>
        </div>

        {talent.bio && <p className="text-sm text-muted-foreground line-clamp-3">{talent.bio}</p>}

        <div className="flex flex-wrap items-center gap-2">
          {talent.onTimeDeliveryRate && (
            <Badge variant="outline">On-time: {(talent.onTimeDeliveryRate * 100).toFixed(0)}%</Badge>
          )}
          <Badge variant="outline">{talent.rating >= 4.8 ? "Top Rated" : talent.rating >= 4.0 ? "Verified" : "New"}</Badge>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 pt-3">
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => onViewProfile?.(talent.id)}
          >
            View profile
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/dashboard/messages?userId=${talent.userId ?? talent.id}`}
              className="inline-flex"
            >
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <span>Message</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
