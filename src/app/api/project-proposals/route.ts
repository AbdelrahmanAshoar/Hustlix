export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("ProjectId");

    const res = await fetch(
      `${API_BASE_URL}/api/Client/project-proposals/filter?ProjectId=${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = [];
    }

    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);

    return Response.json([], { status: 500 });
  }
}
