import { API_BASE_URL } from "@/config"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const token = cookies().get("token")?.value

    const res = await fetch(`${API_BASE_URL}/api/Client/post-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    // 🔥 رجّع نفس status ونفس الرسالة
    return new Response(JSON.stringify(data), {
      status: res.status,
    })

  } catch (err) {
    console.log("SERVER ERROR:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}