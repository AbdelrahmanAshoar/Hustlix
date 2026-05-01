export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    const formData = await req.formData();

    const res = await fetch(`${API_BASE_URL}/api/User/upload-attachment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

