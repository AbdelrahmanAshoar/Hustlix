import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(
      `http://proafree.runasp.net/api/Freelancer/GetProject/${params.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
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