import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const tempAuthLogin = request.cookies.get("temp_auth_login")?.value;

  if (tempAuthLogin) {
    return NextResponse.json({ authLogin: tempAuthLogin });
  }

  return NextResponse.json({ authLogin: null });
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("temp_auth_login");
  return response;
}
