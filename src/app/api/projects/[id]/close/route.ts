export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/config"
import { cookies } from "next/headers"
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(
    `${API_BASE_URL}/api/Client/close-project/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const text = await res.text()

  if (!res.ok) {
    return Response.json(
      { success: false, message: text || "Failed" },
      { status: 500 }
    )
  }

  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  return Response.json({
    success: true,
    message: "Project closed",
    data,
  })
}

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  return PUT(req, context)
}

