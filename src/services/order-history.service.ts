import { apiClient } from "@/lib/api-client";

export interface OrderHistoryItem {
  Authlogin: string;
  FullName: string;
  ProductId: string;
  RDate: string;
  ProductName: string;
  Rkprice: number;
  PackageName: string;
  CreatedDate: string;
  IsDist: string | null;
  Paymentmode: string;
  IsExpire: string | null;
  Remark: string;
  Active: boolean;
}

export interface BoosterOrderHistoryItem {
  ActivationDate: string;
  BoosterValue: number;
  BoosterStatus: string;
  Btype: string;
}

export interface AgentLicenseHistoryItem {
  Authlogin: string;
  FullName: string;
  agentName: string;
  description: string;
  agentImage: string;
  PartnerId: string;
  DDate: string;
  Amount: number;
  PartnerCategoryName: string;
  PartnerName: string;
  PartnerDescription: string;
  MarketplaceUrl: string;
  APY: number;
  rating: number;
  ConsumedCredit: number;
  CreatedDate: string;
  IsDist: string | null;
  Paymentmode: string;
  IsExpire: string | null;
  Remark: string;
  Active: boolean;
  AgCrDepStatus: boolean;
  [key: string]: unknown;
}

function extractRows(payload: unknown): AgentLicenseHistoryItem[] {
  if (Array.isArray(payload)) return payload as AgentLicenseHistoryItem[];
  if (typeof payload !== "object" || payload === null) return [];

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.data,
    record.incomeTransTypes,
    record.result,
    record.records,
    record.rows,
    record.licenses,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as AgentLicenseHistoryItem[];
    if (typeof candidate === "object" && candidate !== null) {
      const nested = candidate as Record<string, unknown>;
      for (const key of [
        "incomeTransTypes",
        "data",
        "result",
        "records",
        "rows",
        "licenses",
        "items",
        "list",
      ]) {
        if (Array.isArray(nested[key])) {
          return nested[key] as AgentLicenseHistoryItem[];
        }
      }
    }
  }
  return [];
}

export const orderHistoryService = {
  list: (type?: string) =>
    apiClient.get<{ statusCode: number; message: string; data: OrderHistoryItem[] }>(
      "/FundManager/recharge-details",
      { params: type ? { Type: type } : undefined }
    ),
  getBoosterOrderHistory: () =>
    apiClient.get<{ statusCode: number; message: string; data: BoosterOrderHistoryItem[] }>(
      "/FundManager/booster-history"
    ),
  getAgentLicenseHistory: async () => {
    const payload = await apiClient.post<unknown>(
      "/WalletReport/getAgentLicenseHistoryUser",
      {}
    );
    return extractRows(payload);
  },
};
