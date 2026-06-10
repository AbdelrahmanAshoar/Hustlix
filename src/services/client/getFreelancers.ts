import { API_BASE_URL } from "@/config";

export type FreelancerSkill = {
  id: number;
  name: string;
};

export type TalentProfile = {
  id: number;
  userId?: number;
  fullName: string;
  email: string;
  profilePictureUrl: string | null;
  bio: string | null;
  hourlyRate: number | null;
  experienceLevel: string | null;
  rating: number;
  completedProjects: number;
  onTimeDeliveryRate: number | null;
  skills: FreelancerSkill[];
};

export type GetFreelancersResponse = {
  data: TalentProfile[];
};

// Utility function to get token from cookies
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookieString = document.cookie;
  const cookies = cookieString.split(';').map(c => c.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith('token=')) {
      return cookie.substring(6); // Remove 'token=' prefix
    }
  }

  return null;
}

export async function getFreelancers(
  params: Partial<{
    search: string;
    name: string;
    jobTitle: string;
    skills: string;
    location: string;
    page: number;
    limit: number;
  }> = {}
): Promise<GetFreelancersResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.name) searchParams.set("name", params.name);
  if (params.jobTitle) searchParams.set("jobTitle", params.jobTitle);
  if (params.skills) searchParams.set("skills", params.skills);
  if (params.location) searchParams.set("location", params.location);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  // Get token from cookies
  const token = getTokenFromCookie();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/Client/all-freelancers?${searchParams.toString()}`, {
      cache: "no-store",
      headers,
    });

    if (!res.ok) {

      // Try to get error message from response
      try {
        const errorData = await res.json();
      } catch {
        console.error("❌ Could not parse error response");
      }

      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    // API returns array directly, wrap it in object with data property
    // Fix profile picture URLs to include full backend URL
    const fixedData = data.map((freelancer: TalentProfile) => ({
      ...freelancer,
      profilePictureUrl: freelancer.profilePictureUrl
        ? `${API_BASE_URL}${freelancer.profilePictureUrl}`
        : null
    }));

    return { data: fixedData };
  } catch (error) {
    throw error;
  }
}
