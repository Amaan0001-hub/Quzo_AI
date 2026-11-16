import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { getServerEnv } from "@/lib/env";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, Email, EnquiryType, message } = body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof Email !== "string" ||
      !Email.trim() ||
      typeof EnquiryType !== "string" ||
      !EnquiryType.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return errorResponse("All fields are required.", 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email.trim())) {
      return errorResponse("Invalid email address.", 400);
    }

    // Validate message length
    if (message.trim().length < 10 || message.trim().length > 1000) {
      return errorResponse("Message must be between 10 and 1000 characters.", 400);
    }

    // Call the external API
    const { BACKEND_API_URL } = getServerEnv();
    const { data } = await axios.post(
      `${BACKEND_API_URL}/Ticket/addContactUs`,
      {
        name: name.trim(),
        Email: Email.trim(),
        EnquiryType: EnquiryType.trim(),
        message: message.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Contact us submission failed:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(error.response.data, {
          status: error.response.status,
        });
      }
    }

    return errorResponse("Failed to submit contact form. Please try again.", 502);
  }
}
