export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    const body = await req.json();

    const res = await fetch(`${API_BASE_URL}/api/Client/approve-work`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown = { message: text };

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

