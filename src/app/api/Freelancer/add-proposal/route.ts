// app/api/Freelancer/add-proposal/route.ts
import { API_BASE_URL } from "@/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    console.log("Token found:", !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received request body:", body);

    // Validate required fields
    if (!body.projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!body.proposedPrice || body.proposedPrice <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid proposed price is required" },
        { status: 400 }
      );
    }

    if (!body.deliveryDays || body.deliveryDays <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid delivery days are required" },
        { status: 400 }
      );
    }

    if (!body.coverLetter || body.coverLetter.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Cover letter is required" },
        { status: 400 }
      );
    }

    // Prepare payload exactly as Postman expects
    const payload = {
      projectId: Number(body.projectId),
      proposedPrice: Number(body.proposedPrice),
      deliveryDays: Number(body.deliveryDays),
      coverLetter: body.coverLetter.trim(),
    };

    console.log("Sending to external API:", payload);

    // Make request to external API
    const response = await fetch(
      `${API_BASE_URL}/api/Freelancer/add-proposal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    console.log("External API response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to submit proposal to external API" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Proposal submitted successfully",
      data: data 
    }, { status: 200 });

  } catch (err: any) {
    console.error("API Error in /api/Freelancer/add-proposal:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}