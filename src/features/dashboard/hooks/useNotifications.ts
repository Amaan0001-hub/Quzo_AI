import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { QUERY_KEYS } from "@/lib/constants";

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.all,
    queryFn: notificationService.getAll,
    enabled,
  });
}
