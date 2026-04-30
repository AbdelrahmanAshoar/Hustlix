import Image from "next/image";
import Link from "next/link";
import { CalendarDays, BriefcaseBusiness, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileHeader({ data }) {
  const { auth, personalInfo, professionalInfo, portfolio, profileProgress } = data;
  const { userRole } = useAuth();

  const getFullUrl = (path) => {
    if (!path) return "/default.png";
    if (path.startsWith("data:image")) return path;
    return `http://proafree.runasp.net${path}`;
  };

  const joinedDate = auth?.createdAt
    ? new Date(auth.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;
  const username = auth?.email ? `@${auth.email.split("@")[0]}` : null;
  const skillsCount = professionalInfo?.skills?.length || 0;
  const projectsCount = portfolio?.projects?.length || 0;
  const stats = userRole === "Client"
    ? [
        { label: "Projects", value: projectsCount },
        { label: "Rating", value: data?.averageRating ? `${data.averageRating.toFixed(1)}/5` : "0.0/5" },
        { label: "Role", value: auth?.userRole || "-" },
      ]
    : [
        { label: "Projects", value: projectsCount },
        { label: "Skills", value: skillsCount },
        { label: "Profile", value: `${profileProgress || 0}%` },
        { label: "Role", value: auth?.userRole || "-" },
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6">
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-[#eef2ff] text-slate-900 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_88%_0%,rgba(99,102,241,0.11),transparent_30%)]" />
        <div className="pointer-events-none absolute -right-16 top-8 h-52 w-52 rounded-full bg-blue-200/50 blur-2xl" />
        <div className="pointer-events-none absolute -right-8 top-24 h-28 w-28 rounded-full border border-blue-100 bg-white/70 backdrop-blur-md" />

        <div className="relative p-6 md:p-8">
          <Link
            href="/settings"
            className="absolute right-6 top-6 rounded-xl border border-blue-200 bg-white/70 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-white"
          >
            Edit Profile
          </Link>

          <div className="flex flex-col gap-5 pr-0 md:pr-36">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
                <Image
                  src={getFullUrl(personalInfo?.photoUrl)}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-bold leading-tight text-slate-900">{personalInfo?.fullName || "User"}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {username ? `${username} - ` : ""}
                  {professionalInfo?.jobTitle || "No job title yet"}
                </p>
              </div>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-slate-600">
              {professionalInfo?.about || "Add a short professional summary to make your profile stand out."}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              {personalInfo?.address && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {personalInfo.address}
                </span>
              )}
              {joinedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                  Joined {joinedDate}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-4 w-4 text-blue-500" />
                {auth?.userRole || userRole || "User"}
              </span>
            </div>
          </div>
        </div>

        <div className={`relative grid border-t border-blue-100 bg-white/35 ${userRole === "Client" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={`px-6 py-4 ${index > 0 ? "border-t border-blue-100 md:border-t-0 md:border-l md:border-blue-100" : ""}`}
            >
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
