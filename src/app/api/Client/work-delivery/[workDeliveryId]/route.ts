export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { workDeliveryId: string } }
) {
  try {
    const token = cookies().get("token")?.value;

    const res = await fetch(
      `${API_BASE_URL}/api/Client/work-delivery/${params.workDeliveryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

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

