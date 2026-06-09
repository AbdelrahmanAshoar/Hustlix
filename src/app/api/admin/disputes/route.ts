export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    const res = await fetch(`${API_BASE_URL}/api/Admin/disputes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : [];
    } catch {
      data = text;
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: (data as any)?.message || "Failed to fetch disputes" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
