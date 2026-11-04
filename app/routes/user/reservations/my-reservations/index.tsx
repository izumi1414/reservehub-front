import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DataTable } from "~/components/ui/DataTable";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { Button } from "~/components/ui/Button";
import {
  cancelReservation,
  getMyReservations,
} from "~/features/reservations/api";
import type { MyReservation } from "~/features/reservations/types";

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<MyReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyReservations() {
      try {
        const res = await getMyReservations();
        setReservations(res);
      } catch (err) {
        console.error(err)
        setError("予約一覧の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyReservations()
  }, [])

  const formatStartAt = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleCancel = async (reservation: MyReservation) => {
    if (!window.confirm("この予約をキャンセルしますか？")) {
      return;
    }

    setError("");
    setCancelingId(reservation.reservation_id);

    try {
      await cancelReservation(reservation.reservation_id);
      setReservations((currentReservations) =>
        currentReservations.map((item) =>
          item.reservation_id === reservation.reservation_id
            ? { ...item, status: "cancelled" }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("予約のキャンセルに失敗しました");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">マイ予約一覧</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable<MyReservation>
          columns={[
            {
              id: "customer_name",
              header: "予約者名",
              render: (row) => row.customer_name,
            },
            {
              id: "start_at",
              header: "予約開始日時",
              render: (row) => formatStartAt(row.start_at),
            },
            {
              id: "status",
              header: "ステータス",
              render: (row) => (
                <StatusBadge
                  label={
                    row.status === "confirmed"
                      ? "確定"
                      : row.status === "cancelled"
                        ? "キャンセル済み"
                        : row.status
                  }
                  variant={
                    row.status === "confirmed"
                      ? "success"
                      : row.status === "cancelled"
                        ? "danger"
                        : "neutral"
                  }
                />
              ),
            },
            {
              id: "action",
              header: "操作",
              render: (row) => (
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={
                      row.status !== "confirmed" ||
                      cancelingId === row.reservation_id
                    }
                    isLoading={cancelingId === row.reservation_id}
                    onClick={() => handleCancel(row)}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(`/my/reservations/${row.reservation_id}`)
                    }
                  >
                    確認
                  </Button>
                </div>
              ),
            },
          ]}
          data={reservations}
          rowKey={(row) => row.reservation_id}
          isLoading={isLoading}
          emptyMessage="予約がありません"
        />
      )}
    </div>
  )
}
