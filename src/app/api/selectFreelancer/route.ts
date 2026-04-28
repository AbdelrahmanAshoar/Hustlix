import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const body = await req.json();
    const { proposalId } = body;

    if (!proposalId) {
      return Response.json(
        { success: false, message: "proposalId is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      "http://proafree.runasp.net/api/Client/select-freelancer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proposalId }),
      }
    );

    // ✅ الحل هنا
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

if (!res.ok) {
  return Response.json({
    success: false,
    message: data?.message || "Failed",
  });
}

    return Response.json(data);
  } catch (error) {
    console.error("API route error:", error);

    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}