export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/Freelancer/suggested-projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    // Handle subscription-required responses from the backend (402 / 403)
    if (res.status === 402 || res.status === 403) {
      return NextResponse.json(
        {
          subscriptionRequired: true,
          message:
            (data as Record<string, string>)?.message ||
            "This feature requires an active subscription.",
        },
        { status: res.status }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            (data as Record<string, string>)?.message ||
            "Failed to fetch suggested projects",
        },
        { status: res.status }
      );
    }

    // Normalise: backend may return a single object or an array
    const projects = Array.isArray(data) ? data : data ? [data] : [];
    return NextResponse.json(projects, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
