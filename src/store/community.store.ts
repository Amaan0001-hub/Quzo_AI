import { create } from "zustand";
import type { DirectMember } from "@/services/community.service";

interface PersonalTeamMember {
  uLvl?: number;
  Loginid?: string;
  SponsorId?: string;
  Name?: string;
  RegDate?: string;
  Email?: string;
  Mobile?: string;
  Urank?: string;
  status?: string;
  SubscriptionAmount?: number;
  SubscribeDate?: string;
  DeployDate?: string;
  TeamBusiness?: number;
  ActiveTeam?: number;
  totTeam?: number;
  CountryFlag?: string;
  CountryId?: number;
  Package?: number;
}

interface LeftRightDownlineMember {
  uLvl?: number;
  Loginid?: string;
  Name?: string;
  RegDate?: string;
  Topup?: string;
  Position?: string;
  TopupDate?: string;
  Package?: number;
  TeamBusiness?: number;
  Country_Code?: string;
  Country_Name?: string;
  CountryFlag?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getLeftRightRows(payload: unknown): LeftRightDownlineMember[] {
  let value = payload;
  for (let depth = 0; depth < 5 && isRecord(value); depth += 1) {
    if (value.success === false) {
      throw new Error(
        typeof value.message === "string"
          ? value.message
          : "Failed to fetch left/right downline data",
      );
    }
    value = value.data;
  }

  if (!Array.isArray(value)) {
    throw new Error("Left/right downline response has an invalid format.");
  }

  return value.filter((row): row is LeftRightDownlineMember => isRecord(row));
}

interface CommunityState {
  directMemberData: DirectMember[];
  personalTeamData: PersonalTeamMember[];
  leftRightData: LeftRightDownlineMember[];
  loading: boolean;
  error: string | null;
  setDirectMemberData: (data: DirectMember[]) => void;
  setPersonalTeamData: (data: PersonalTeamMember[]) => void;
  setLeftRightData: (data: LeftRightDownlineMember[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearDirectMemberData: () => void;
  clearPersonalTeamData: () => void;
  clearLeftRightData: () => void;
  fetchLeftRightData: (params: {
    uRank?: string;
    lvl?: string;
    statusId?: string;
  }) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  directMemberData: [],
  personalTeamData: [],
  leftRightData: [],
  loading: false,
  error: null,
  setDirectMemberData: (data) => set({ directMemberData: data }),
  setPersonalTeamData: (data) => set({ personalTeamData: data }),
  setLeftRightData: (data) => set({ leftRightData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearDirectMemberData: () => set({ directMemberData: [], error: null }),
  clearPersonalTeamData: () => set({ personalTeamData: [], error: null }),
  clearLeftRightData: () => set({ leftRightData: [], error: null }),
  fetchLeftRightData: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/Community/getPersonalTeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uRank: params.uRank || "",
          lvl: params.lvl || "",
          statusId: params.statusId || "",
        }),
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          isRecord(payload) && typeof payload.message === "string"
            ? payload.message
            : "Failed to fetch left/right downline data",
        );
      }

      set({ leftRightData: getLeftRightRows(payload), loading: false });
    } catch (error) {
      set({
        leftRightData: [],
        error: error instanceof Error ? error.message : "Failed to fetch left/right downline data",
        loading: false,
      });
    }
  },
}));
