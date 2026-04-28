import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const body = await req.json();

    const res = await fetch(
      "http://proafree.runasp.net/api/Client/update-project",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json().catch(() => null);

    return Response.json(data, { status: res.status });
  } catch (err: any) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}