import { apiClient } from "~/lib/api/client";
import type { ReservationSlot } from "./types";

/**
 * 指定日から7日間の予約枠を取得する
 */
export async function getSlots(date: string) {
  return apiClient.get<ReservationSlot[]>(
    `/api/slots?date=${date}`,
    false
  );
}
