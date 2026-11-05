import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { DataTable } from "~/components/ui/DataTable";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { Select } from "~/components/ui/Select";
import { ApiError } from "~/lib/api/errors";
import { getReservationsForAdmin } from "../api";
import type { Reservation } from "../types";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AdminReservationList() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");

  async function loadReservations() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getReservationsForAdmin();
      setReservations(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
      } else if (err instanceof ApiError && err.status === 403) {
        setError("予約一覧を表示する権限がありません。");
      } else {
        setError("予約一覧の取得に失敗しました。通信状態を確認してください。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  const filteredReservations = reservations.filter((reservation) =>
    statusFilter === "all"
      ? true
      : reservation.status === statusFilter
  );

  return (
    <div>
      <div className="mb-4 max-w-xs">
        <Select
          id="reservation-status-filter"
          label="ステータス"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | "confirmed" | "cancelled"
            )
          }
          options={[
            { label: "すべて", value: "all" },
            { label: "確定", value: "confirmed" },
            { label: "キャンセル済み", value: "cancelled" },
          ]}
        />
      </div>
      {error && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700" role="alert">{error}</p>
          <Button variant="secondary" size="sm" onClick={loadReservations}>
            再読み込み
          </Button>
        </div>
      )}
      <DataTable<Reservation>
        columns={[
          {
            id: "customer_name",
            header: "予約者名",
            render: (reservation) => reservation.customer_name,
          },
          {
            id: "customer_email",
            header: "メールアドレス",
            render: (reservation) => (
              <span className="break-all">{reservation.customer_email}</span>
            ),
          },
          {
            id: "start_at",
            header: "予約日時",
            render: (reservation) => formatDateTime(reservation.start_at),
          },
          {
            id: "status",
            header: "ステータス",
            render: (reservation) => (
              <StatusBadge
                label={reservation.status === "confirmed" ? "確定" : "キャンセル済み"}
                variant={reservation.status === "confirmed" ? "success" : "danger"}
              />
            ),
          },
          {
            id: "actions",
            header: "操作",
            render: (reservation) => (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/admin/reservations/${reservation.reservation_id}`)}
              >
                詳細
              </Button>
            ),
          },
        ]}
        data={filteredReservations}
        rowKey={(reservation) => reservation.reservation_id}
        isLoading={isLoading}
        emptyMessage="予約がありません"
        onRowClick={(reservation) =>
          navigate(`/admin/reservations/${reservation.reservation_id}`)
        }
      />
    </div>
  );
}
