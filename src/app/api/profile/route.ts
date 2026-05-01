export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    const res = await fetch(`${API_BASE_URL}/api/User/my-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
