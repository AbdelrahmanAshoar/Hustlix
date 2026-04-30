import { useEffect, useMemo, useState } from "react";
import OverviewTab from "./OverviewTab";
import PortfolioTab from "./PortfolioTab";
import HiringHistoryTab from "./HiringHistoryTab";
import ReviewsTab from "./ReviewsTab";
import { useAuth } from "@/contexts/AuthContext";
import { Code2 } from "lucide-react";

export default function ProfileTabs({ data, tab, setTab }) {
  const { userRole } = useAuth();
  const [skillsFromApi, setSkillsFromApi] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const localSkills = useMemo(() => {
    if (!Array.isArray(data?.professionalInfo?.skills)) return [];
    return data.professionalInfo.skills.map((skill, index) => ({
      id: index + 1,
      name: skill,
      relevanceScore: null,
      category: "general",
    }));
  }, [data?.professionalInfo?.skills]);

  useEffect(() => {
    let mounted = true;
    if (userRole !== "Freelancer") return;

    const fetchSkills = async () => {
      setSkillsLoading(true);
      try {
        const res = await fetch("/api/skills", { cache: "no-store" });
        const payload = await res.json();

        const rawList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        const parsed = rawList
          .filter((item) => item && typeof item.name === "string")
          .map((item, index) => ({
            id: item.id ?? index + 1,
            name: item.name,
            category: item.category ?? "general",
            relevanceScore:
              typeof item.relevanceScore === "number"
                ? Math.max(0, Math.min(100, item.relevanceScore))
                : null,
          }));

        if (mounted) {
          setSkillsFromApi(parsed);
        }
      } catch {
        if (mounted) {
          setSkillsFromApi([]);
        }
      } finally {
        if (mounted) {
          setSkillsLoading(false);
        }
      }
    };

    fetchSkills();
    return () => {
      mounted = false;
    };
  }, [userRole]);

  const skills = skillsFromApi.length > 0 ? skillsFromApi : localSkills;

  const tabs = ["overview", "reviews"];
  if (userRole === "Freelancer") tabs.splice(1, 0, "portfolio");
  if (userRole === "Client") tabs.splice(1, 0, "Hiring History");

  return (
    <div className="max-w-5xl mx-auto px-4 mt-4 mb-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">

          {/* Tab Bar */}
          <div className="flex border-b border-gray-100 px-2 pt-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-5 py-3 text-sm font-medium capitalize transition-colors rounded-t-xl whitespace-nowrap"
                style={{
                  color: tab === t ? "#2563eb" : "#6b7280",
                  background: tab === t ? "#eff6ff" : "transparent",
                }}
              >
                {t}
                {tab === t && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ background: "#2563eb" }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tab === "overview" && <OverviewTab data={data} />}
            {tab === "portfolio" && userRole === "Freelancer" && <PortfolioTab data={data} />}
            {tab === "Hiring History" && userRole === "Client" && <HiringHistoryTab data={data} />}
            {tab === "reviews" && <ReviewsTab />}
          </div>
        </div>

        {userRole === "Freelancer" && (
          <aside className="self-start lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Skills</h3>
              </div>

              {skillsLoading && (
                <p className="text-sm text-gray-500">Loading skills...</p>
              )}

              {!skillsLoading && skills.length > 0 ? (
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={`${skill.id}-${skill.name}`}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{skill.name}</span>
                        {typeof skill.relevanceScore === "number" && (
                          <span className="font-semibold text-blue-700">{skill.relevanceScore}%</span>
                        )}
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-blue-100">
                        <div
                          className="h-1.5 rounded-full bg-blue-600 transition-all"
                          style={{ width: `${typeof skill.relevanceScore === "number" ? skill.relevanceScore : 65}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !skillsLoading && <p className="text-sm text-gray-400">No skills added yet</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
