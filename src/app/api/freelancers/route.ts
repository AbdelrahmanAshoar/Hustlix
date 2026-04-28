import { NextResponse } from "next/server";

const talent = [
  {
    id: 1,
    fullName: "Lina Hassan",
    title: "Senior UI/UX Designer",
    location: "Cairo, Egypt",
    hourlyRate: 55,
    rating: 4.9,
    reviewsCount: 120,
    skills: ["Figma", "React", "Tailwind", "UX Research"],
    category: "Design",
    availability: "Available",
    experienceYears: 6,
    shortBio:
      "Designs digital products that feel polished, usable, and delightful.",
    profilePictureUrl: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 2,
    fullName: "Youssef Adel",
    title: "Full Stack Developer",
    location: "Alexandria, Egypt",
    hourlyRate: 65,
    rating: 4.8,
    reviewsCount: 98,
    skills: ["Next.js", "Node.js", "TypeScript", "Prisma"],
    category: "Development",
    availability: "Busy",
    experienceYears: 7,
    shortBio: "Building scalable web apps and backend systems with clean code.",
    profilePictureUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    fullName: "Nada El-Sayed",
    title: "Digital Marketing Expert",
    location: "Giza, Egypt",
    hourlyRate: 45,
    rating: 4.7,
    reviewsCount: 84,
    skills: ["SEO", "Google Ads", "Content Strategy"],
    category: "Marketing",
    availability: "Available",
    experienceYears: 5,
    shortBio: "Helping brands grow with data-driven marketing campaigns.",
    profilePictureUrl: "https://i.pravatar.cc/150?img=45",
  },
  {
    id: 4,
    fullName: "Omar Kamal",
    title: "React Native Engineer",
    location: "Sharjah, UAE",
    hourlyRate: 70,
    rating: 4.9,
    reviewsCount: 110,
    skills: ["React Native", "Expo", "GraphQL"],
    category: "Mobile",
    availability: "Available",
    experienceYears: 8,
    shortBio: "Building engaging mobile apps for startups and enterprises.",
    profilePictureUrl: "https://i.pravatar.cc/150?img=18",
  },
  {
    id: 5,
    fullName: "Mona Saad",
    title: "Content Writer & Copywriter",
    location: "Dubai, UAE",
    hourlyRate: 35,
    rating: 4.6,
    reviewsCount: 62,
    skills: ["Copywriting", "Content Strategy", "Blogging"],
    category: "Writing",
    availability: "Busy",
    experienceYears: 4,
    shortBio: "Crafting messages that convert and tell your brand story.",
    profilePictureUrl: "https://i.pravatar.cc/150?img=25",
  },
  {
    id: 6,
    fullName: "Karim Farouk",
    title: "Frontend Developer",
    location: "Cairo, Egypt",
    hourlyRate: 50,
    rating: 4.8,
    reviewsCount: 104,
    skills: ["React", "Next.js", "Tailwind", "CSS"],
    category: "Development",
    availability: "Available",
    experienceYears: 5,
    shortBio: "Turning designs into fast, responsive user experiences.",
    profilePictureUrl: "https://i.pravatar.cc/150?img=8",
  },
];

type QueryParams = {
  search?: string;
  category?: string;
  availability?: string;
  minRate?: string;
  maxRate?: string;
  page?: string;
  limit?: string;
};

const normalize = (value?: string) => value?.trim().toLowerCase() || "";

export function GET(req: Request) {
  const url = new URL(req.url);
  const params: QueryParams = {
    search: url.searchParams.get("search") || undefined,
    category: url.searchParams.get("category") || undefined,
    availability: url.searchParams.get("availability") || undefined,
    minRate: url.searchParams.get("minRate") || undefined,
    maxRate: url.searchParams.get("maxRate") || undefined,
    page: url.searchParams.get("page") || undefined,
    limit: url.searchParams.get("limit") || undefined,
  };

  const searchValue = normalize(params.search);
  const categoryValue = normalize(params.category) === "all" ? "" : normalize(params.category);
  const availabilityValue = normalize(params.availability) === "all" ? "" : normalize(params.availability);
  const minRate = params.minRate ? Number(params.minRate) : undefined;
  const maxRate = params.maxRate ? Number(params.maxRate) : undefined;
  const page = params.page ? Math.max(1, Number(params.page)) : 1;
  const limit = params.limit ? Math.max(1, Number(params.limit)) : 12;

  const filtered = talent.filter((freelancer) => {
    const matchesSearch =
      !searchValue ||
      freelancer.fullName.toLowerCase().includes(searchValue) ||
      freelancer.title.toLowerCase().includes(searchValue) ||
      freelancer.skills.some((skill) => skill.toLowerCase().includes(searchValue));

    const matchesCategory =
      !categoryValue ||
      freelancer.category.toLowerCase() === categoryValue;

    const matchesAvailability =
      !availabilityValue ||
      freelancer.availability.toLowerCase() === availabilityValue;

    const matchesMinRate = minRate === undefined || freelancer.hourlyRate >= minRate;
    const matchesMaxRate = maxRate === undefined || freelancer.hourlyRate <= maxRate;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability &&
      matchesMinRate &&
      matchesMaxRate
    );
  });

  const startIndex = (page - 1) * limit;
  const paged = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    data: paged,
    total: filtered.length,
    page,
    limit,
  });
}
