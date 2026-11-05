import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/Button";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { ApiError } from "~/lib/api/errors";
import { getReservationDetailForAdmin } from "../api";
import type { Reservation } from "../types";

function formatDateTime(value?: string) {
  if (!value) return "日時を取得できませんでした";
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

function formatTime(value?: string) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function AdminReservationDetail() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReservation() {
    if (!reservationId) {
      setError("予約IDを取得できませんでした。");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await getReservationDetailForAdmin(reservationId);
      setReservation(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("対象の予約が見つかりません。");
      } else if (err instanceof ApiError && err.status === 400) {
        setError("予約IDが正しく指定されていません。");
      } else if (err instanceof ApiError && err.status === 401) {
        setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
      } else if (err instanceof ApiError && err.status === 403) {
        setError("予約詳細を表示する権限がありません。");
      } else {
        setError("予約詳細の取得に失敗しました。通信状態を確認してください。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReservation();
  }, [reservationId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        予約詳細を読み込んでいます...
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">予約詳細を表示できません</h2>
        {error && <p className="mt-3 text-sm text-red-500" role="alert">{error}</p>}
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate("/admin/reservations")}>
            予約一覧へ戻る
          </Button>
          {reservationId && (
            <Button onClick={loadReservation}>再読み込み</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">予約情報</h2>
        <StatusBadge
          label={reservation.status === "confirmed" ? "確定" : "キャンセル済み"}
          variant={reservation.status === "confirmed" ? "success" : "danger"}
        />
      </div>

      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">予約枠</p>
          <p className="mt-1 font-semibold text-gray-800">
            {formatDateTime(reservation.start_at)}
          </p>
          <p className="mt-1 text-lg font-bold text-sky-700">
            {formatTime(reservation.start_at)} ～ {formatTime(reservation.end_at)}
          </p>
        </div>
        <dl className="grid gap-0 sm:grid-cols-2">
          <div className="border-b border-gray-100 px-6 py-4 sm:border-r">
            <dt className="text-sm text-gray-500">予約者名</dt>
            <dd className="mt-1 font-medium text-gray-800">{reservation.customer_name}</dd>
          </div>
          <div className="border-b border-gray-100 px-6 py-4">
            <dt className="text-sm text-gray-500">メールアドレス</dt>
            <dd className="mt-1 break-all font-medium text-gray-800">{reservation.customer_email}</dd>
          </div>
          <div className="border-b border-gray-100 px-6 py-4 sm:border-r">
            <dt className="text-sm text-gray-500">予約ID</dt>
            <dd className="mt-1 break-all text-sm text-gray-800">{reservation.reservation_id}</dd>
          </div>
          <div className="border-b border-gray-100 px-6 py-4">
            <dt className="text-sm text-gray-500">予約枠ID</dt>
            <dd className="mt-1 break-all text-sm text-gray-800">{reservation.slot_id}</dd>
          </div>
          <div className="px-6 py-4 sm:col-span-2">
            <dt className="text-sm text-gray-500">予約作成日時</dt>
            <dd className="mt-1 text-sm text-gray-800">{formatDateTime(reservation.created_at)}</dd>
          </div>
        </dl>
      </div>
      <Button variant="secondary" onClick={() => navigate("/admin/reservations")}>
        予約一覧へ戻る
      </Button>
    </div>
  );
}
