import { apiClient } from "@/lib/api-client";

export interface Notification {
  NotificationDate: string;
  AdminRemarks: string;
  message: string | null;
  Amount: string | null;
  Seen: boolean;
}

export interface NotificationResponse {
  statusCode: number;
  message: string;
  data: Notification[];
}

export const notificationService = {
  getAll: () => apiClient.get<NotificationResponse>("/notifications?scope=all"),
};
