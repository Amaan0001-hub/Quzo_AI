import { NextResponse, type NextRequest } from "next/server";
import { createBackendClient } from "@/lib/backend-client";
import axios from "axios";

export async function POST(request: NextRequest) {
  // Frontend se data lein (Userid ko Email ki tarah use kar rahe hain)
  const body = await request.json().catch(() => null);

  // Swagger ke hisaab se backend ko "Email" chahiye
  // Agar aapka frontend userid bhej raha hai, toh usko Email maan lijiye
  const email = body?.userid || body?.Email; 

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email (userid) is required" },
      { status: 400 },
    );
  }

  try {
    const backend = createBackendClient();
    
    // POST request ke sath Query Parameter bhejna
    // Swagger ke hisaab se URL: /SMTP/sendOtpforRegistration?Email=...
    const { data } = await backend.post(
      `/SMTP/sendOtpforRegistration?Email=${encodeURIComponent(email)}`,
      {}, // Body empty bhejni hai
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("OTP send error:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP";
      
      // Specific 401 error handling
      if (errorMessage === "Details are incorrect, please enter correct credentials.") {
        return NextResponse.json(
          { success: false, message: "Invalid userid or password" },
          { status: 401 },
        );
      }
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 },
    );
  }
}