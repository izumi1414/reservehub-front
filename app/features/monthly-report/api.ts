import { apiClient } from "~/lib/api/client";
import type { MonthlyReport } from "./types";

export function getMonthlyReport(month: string) {
  return apiClient.get<MonthlyReport>(
    `/api/reports/monthly?month=${encodeURIComponent(month)}`
  );
}
