export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("fileUrl") || "";

    const res = await fetch(
      `${API_BASE_URL}/api/User/preview-attachment?fileUrl=${encodeURIComponent(
        fileUrl
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

