import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { createBackendClient } from "@/lib/backend-client";
import { getServerEnv } from "@/lib/env";
import { isTokenExpired } from "@/lib/jwt";
import { unauthorizedSessionResponse } from "@/lib/session-response";

const walletReportActions = {
  getListofUndeployedAgents: {
    method: "GET",
    path: "/WalletReport/getListofUndeployedAgents",
  },
  getDeploymentPartners: {
    method: "GET",
    path: "/WalletReport/getDeploymentPartners",
  },
  agentDeploymentUser: {
    method: "POST",
    path: "/FundManager/agentDeploymentUser",
  },
  getAgentLicenseHistoryUser: {
    method: "POST",
    path: "/WalletReport/getAgentLicenseHistoryUser",
  },
} as const;

type WalletReportAction = keyof typeof walletReportActions;

function isWalletReportAction(value: string): value is WalletReportAction {
  return Object.hasOwn(walletReportActions, value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getSessionToken(
  request: NextRequest,
): Promise<{ token?: string; error?: NextResponse }> {
  const { SESSION_COOKIE_NAME } = getServerEnv();
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return { error: unauthorizedSessionResponse(SESSION_COOKIE_NAME, "Not authenticated") };
  }

  try {
    const session: unknown = JSON.parse(decodeURIComponent(sessionCookie));
    const token = isRecord(session) ? session.accessToken : undefined;
    if (typeof token !== "string" || !token || isTokenExpired(token)) {
      return {
        error: unauthorizedSessionResponse(
          SESSION_COOKIE_NAME,
          "Session expired or invalid. Please login again.",
        ),
      };
    }
    return { token };
  } catch {
    return {
      error: unauthorizedSessionResponse(
        SESSION_COOKIE_NAME,
        "Invalid session. Please login again.",
      ),
    };
  }
}

function backendErrorResponse(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
  }
  return NextResponse.json(
    { success: false, message: fallbackMessage },
    { status: 502, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function GET(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action: actionName } = await context.params;
  if (!isWalletReportAction(actionName)) {
    return NextResponse.json(
      { success: false, message: "Unknown wallet report action." },
      { status: 404 },
    );
  }

  const action = walletReportActions[actionName];
  if (action.method !== "GET") {
    return NextResponse.json(
      { success: false, message: "Unsupported method for this action." },
      { status: 405 },
    );
  }

  const { token, error } = await getSessionToken(request);
  if (error) return error;

  try {
    const backend = createBackendClient(token);
    const { data } = await backend.get(action.path, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (backendError) {
    console.error(`WalletReport GET failed (${actionName}):`, backendError);
    return backendErrorResponse(backendError, "Wallet report request failed.");
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action: actionName } = await context.params;
  if (!isWalletReportAction(actionName)) {
    return NextResponse.json(
      { success: false, message: "Unknown wallet report action." },
      { status: 404 },
    );
  }

  const action = walletReportActions[actionName];
  if (action.method !== "POST") {
    return NextResponse.json(
      { success: false, message: "Unsupported method for this action." },
      { status: 405 },
    );
  }

  const { token, error } = await getSessionToken(request);
  if (error) return error;

  try {
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body must be a JSON object." },
        { status: 400 },
      );
    }

    if (!isRecord(payload)) {
      return NextResponse.json(
        { success: false, message: "Request body must be a JSON object." },
        { status: 400 },
      );
    }

    const backend = createBackendClient(token);
    const { data } = await backend.post(action.path, payload, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (backendError) {
    console.error(`WalletReport POST failed (${actionName}):`, backendError);
    return backendErrorResponse(backendError, "Wallet report request failed.");
  }
}
