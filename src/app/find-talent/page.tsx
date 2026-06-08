"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getFreelancers, type TalentProfile } from "@/services/client/getFreelancers";
import FindTalentHero from "@/components/findTalent/FindTalentHero";
import TalentCard from "@/components/findTalent/TalentCard";
import TalentFilters from "@/components/findTalent/TalentFilters";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

export default function FindTalentPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [talent, setTalent] = useState<TalentProfile[]>([]);
  const [featuredFreelancers, setFeaturedFreelancers] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(false);
  console.log("Talent data in FindTalentPage:", talent); // Debugging line
  const fetchTalent = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getFreelancers({
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      });

      setTalent(response?.data ?? []);
    } catch (error) {
      console.error("Failed to fetch talent:", error);
      toast.error("Unable to load talent. Please try again.");
      setTalent([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    void fetchTalent();
  }, [fetchTalent]);

  const fetchFeaturedFreelancers = async () => {
    setIsFeaturedLoading(true);
    try {
      const response = await getFreelancers({ page: 1, limit: 4 });
      setFeaturedFreelancers(response?.data ?? []);
    } catch (error) {
      console.error("Unable to load featured freelancers:", error);
      setFeaturedFreelancers([]);
    } finally {
      setIsFeaturedLoading(false);
    }
  };

  useEffect(() => {
    void fetchFeaturedFreelancers();
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    void fetchTalent();
  };

  const handleClearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleViewProfile = (id: number) => {
    toast(`View profile for freelancer ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <FindTalentHero totalTalent={talent?.length ?? 0} />

      <div className="container mx-auto px-4 py-10">
        <section className="mb-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Explore</p>
              <h2 className="text-3xl font-bold">Featured Freelancers</h2>
            </div>
            <Button variant="outline" onClick={() => {
              setSearch("");
              setPage(1);
            }}>
              Browse All
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {isFeaturedLoading ? (
              <div className="col-span-full rounded-3xl bg-white p-8 text-center text-muted-foreground">
                Loading featured freelancers...
              </div>
            ) : featuredFreelancers.length === 0 ? (
              <div className="col-span-full rounded-3xl bg-white p-8 text-center text-muted-foreground">
                No featured freelancers available right now.
              </div>
            ) : (
              featuredFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="rounded-3xl border border-border bg-white p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{freelancer.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{freelancer.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {freelancer.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{freelancer.completedProjects} completed</span>
                    <span>{freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : "Rate not set"}</span>
                  </div>
                  {freelancer.bio && (
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                      {freelancer.bio}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <TalentFilters
          search={search}
          onSearchChange={setSearch}
          onSubmit={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <div className="mt-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Showing</p>
              <h2 className="text-2xl font-bold">Available Talent</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {talent?.length ?? 0} professionals found
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-3xl bg-card p-16 text-muted-foreground">
              Loading talent...
            </div>
          ) : (talent?.length ?? 0) === 0 ? (
            <div className="rounded-3xl bg-card p-16 text-center text-muted-foreground">
              No talent matched your filters.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {talent?.map((item) => (
                <TalentCard
                  key={item.id}
                  talent={item}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {talent?.length ?? 0} professionals
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                className="rounded-full"
                onClick={() => setPage((current) => current + 1)}
                disabled={(talent?.length ?? 0) < PAGE_SIZE}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}