import { cookies } from "next/headers"
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  const res = await fetch(
    `http://proafree.runasp.net/api/Client/close-project/${params.id}`,
    {
      method: "PUT",
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

  return Response.json({
    success: true,
    message: "Project closed",
    data: text ? JSON.parse(text) : null,
  })
}