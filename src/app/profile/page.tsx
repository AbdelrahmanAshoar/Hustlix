"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import Skeleton from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (!data) return <Skeleton />;
  
  return (
    <div className="min-h-screen bg-muted/40">
      <ProfileHeader data={data} />
      <ProfileTabs data={data} tab={tab} setTab={setTab} />
      <div className="h-6" />
    </div>
  );
}
