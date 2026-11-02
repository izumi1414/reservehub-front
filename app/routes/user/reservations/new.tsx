import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { SelectedSlotCard } from "~/features/reservations/components/SelectedSlot";
import { ReservationForm } from "~/features/reservations/components/ReservationForm";
import type { ReservationSlot } from "~/features/slots/types";
import { apiClient } from "~/lib/api/client";
import { useAuth } from "~/features/auth/useAuth";

export default function ReservationNewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const slotId = searchParams.get("slotId");
  const { user } = useAuth();

  const [slot, setSlot] = useState<ReservationSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 予約枠の詳細を取得
  useEffect(() => {
    if (!slotId) {
      setError("予約枠が指定されていません。");
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const fetchSlot = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await apiClient.get<
          ReservationSlot & {
            startAt?: string;
            endAt?: string;
            start_time?: string;
            end_time?: string;
            startTime?: string;
            endTime?: string;
            slot?: ReservationSlot;
          }
        >(
          `/api/slots/${slotId}`,
          false
        );

        if (isActive) {
          const responseSlot = data.slot ?? data;
          const normalizedSlot = {
            ...responseSlot,
            start_at:
              responseSlot.start_at ??
              data.startAt ??
              data.start_time ??
              data.startTime ??
              "",
            end_at:
              responseSlot.end_at ??
              data.endAt ??
              data.end_time ??
              data.endTime ??
              "",
          };

          const startDate = new Date(normalizedSlot.start_at);
          const endDate = new Date(normalizedSlot.end_at);

          if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime())
          ) {
            setError("予約枠の日時情報を取得できませんでした。");
            setSlot(null);
          } else {
            setSlot(normalizedSlot);
          }
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "予約枠の取得に失敗しました。"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchSlot();

    return () => {
      isActive = false;
    };
  }, [slotId]);

  // 入力内容を確認画面へ引き継ぐ
  const handleFormSubmit = (values: {
    customerName: string;
    customerEmail: string;
  }) => {
    navigate("/reservations/confirm", {
      state: {
        slotId,
        startAt: slot?.start_at,
        endAt: slot?.end_at,
        ...values,
      },
    });
  };

  if (isLoading) {
    return <p className="text-gray-500">読み込み中...</p>;
  }

  if (error || !slot) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error ?? "予約枠が見つかりません。"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          予約情報入力
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          予約内容を確認し、必要事項を入力してください。
        </p>
      </div>

      <SelectedSlotCard
        startAt={slot.start_at}
        endAt={slot.end_at}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          予約者情報
        </h2>

        <ReservationForm
          initialEmail={user?.email ?? ""}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}
