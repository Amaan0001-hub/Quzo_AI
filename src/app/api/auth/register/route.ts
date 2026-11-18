import { NextResponse, type NextRequest } from "next/server";
import { createBackendClient } from "@/lib/backend-client";
import { getServerEnv } from "@/lib/env";


export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.fName || !body?.lName || !body?.password || !body?.email) {
    return NextResponse.json(
      { success: false, message: "All required fields must be provided" },
      { status: 400 },
    );
  }

  try {
    const backend = createBackendClient();

    // Transform camelCase to PascalCase for backend
    const backendBody = {
      FName: body.fName,
      LName: body.lName,
      Password: body.password,
      Email: body.email,
      IntroAuth: body.introAuth || undefined,
      OTP: body.OTP || undefined,
    };

    const { data } = await backend.post("/Authentication/userRegistration", backendBody);

    // Extract authLogin for temporary storage
    const { authLogin, ...responseData } = data as { authLogin?: string; [key: string]: unknown };

    // Create response
    const response = NextResponse.json(responseData);

    // Store authLogin in a temporary cookie (HttpOnly, short-lived)
    if (authLogin) {
      const { SESSION_COOKIE_NAME } = getServerEnv();
      response.cookies.set("temp_auth_login", authLogin, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 5, // 5 minutes - short lived
      });
    }

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 },
    );
  }
}
