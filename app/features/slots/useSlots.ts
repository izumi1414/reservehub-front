import { useCallback, useEffect, useState } from "react";
import { getSlots } from "./api";
import type { ReservationSlot } from "./types";

type UseSlotsResult = {
  slots: ReservationSlot[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSlots(date: string): UseSlotsResult {
  const [slots, setSlots] = useState<ReservationSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSlots(date);
      setSlots(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "予約枠の取得に失敗しました。"
      );
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    isLoading,
    error,
    refetch: fetchSlots,
  };
}
