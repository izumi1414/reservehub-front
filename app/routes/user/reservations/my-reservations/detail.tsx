import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { Button } from "~/components/ui/Button";
import {
  cancelReservation,
  getMyReservationById
} from "~/features/reservations/api";
import type { MyReservation } from "~/features/reservations/types";

export default function MyReservationDetailPage() {
  const [reservation, setReservation] = useState<MyReservation>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCanceling, setIsCanceling] = useState(false);

  const { reservationId } = useParams();
  const navigate = useNavigate();

  const formatDateTime = (value?: string) => {
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
  };

  const formatDate = (value?: string) => {
    if (!value) return "日時を取得できませんでした";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    }).format(date);
  };

  const formatTime = (value?: string) => {
    if (!value) return "--:--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const handleCancel = async () => {
    if (!reservation || !window.confirm("この予約をキャンセルしますか？")) {
      return;
    }

    setError("");
    setIsCanceling(true);
    try {
      await cancelReservation(reservation.reservation_id);
      setReservation({ ...reservation, status: "cancelled" });
    } catch (err) {
      console.error(err);
      setError("予約のキャンセルに失敗しました");
    } finally {
      setIsCanceling(false);
    }
  };

  useEffect(() => {
    async function fetchMyReservationById() {
      try {
        if (!reservationId) {
          throw new Error("予約IDの取得ができませんでした")
        }
        const res = await getMyReservationById(reservationId);
        setReservation(res);
      } catch(err) {
        console.error(err);
        setError("予約情報の取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMyReservationById();

  }, [reservationId])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        予約情報を読み込んでいます...
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-gray-800">
          予約詳細を表示できません
        </h1>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={() => navigate("/my/reservations")}
          >
            マイ予約一覧へ戻る
          </Button>
        </div>
      </div>
    );
  }

  const statusLabel =
    reservation.status === "confirmed"
      ? "確定"
      : reservation.status === "cancelled"
        ? "キャンセル済み"
        : reservation.status;
  const statusVariant =
    reservation.status === "confirmed"
      ? "success"
      : reservation.status === "cancelled"
        ? "danger"
        : "neutral";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">予約詳細</h1>
        <StatusBadge label={statusLabel} variant={statusVariant} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">予約日時</p>
          <p className="mt-1 font-semibold text-gray-800">
            {formatDate(reservation.start_at)}
          </p>
          <p className="mt-1 text-lg font-bold text-sky-700">
            {formatTime(reservation.start_at)} ～ {formatTime(reservation.end_at)}
          </p>
        </div>

        <dl className="grid gap-0 sm:grid-cols-2">
          <div className="border-b border-gray-100 px-6 py-4 sm:border-r">
            <dt className="text-sm text-gray-500">予約者名</dt>
            <dd className="mt-1 font-medium text-gray-800">
              {reservation.customer_name}
            </dd>
          </div>
          <div className="border-b border-gray-100 px-6 py-4">
            <dt className="text-sm text-gray-500">メールアドレス</dt>
            <dd className="mt-1 break-all font-medium text-gray-800">
              {reservation.customer_email}
            </dd>
          </div>
          <div className="border-b border-gray-100 px-6 py-4 sm:border-r">
            <dt className="text-sm text-gray-500">予約ID</dt>
            <dd className="mt-1 break-all text-sm text-gray-800">
              {reservation.reservation_id}
            </dd>
          </div>
          <div className="border-b border-gray-100 px-6 py-4">
            <dt className="text-sm text-gray-500">予約作成日時</dt>
            <dd className="mt-1 text-sm text-gray-800">
              {formatDateTime(reservation.created_at)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <Button
          variant="secondary"
          onClick={() => navigate("/my/reservations")}
        >
          マイ予約一覧へ戻る
        </Button>
        <Button
          variant="danger"
          disabled={reservation.status !== "confirmed"}
          isLoading={isCanceling}
          onClick={handleCancel}
        >
          予約をキャンセル
        </Button>
      </div>
    </div>
  );
}
