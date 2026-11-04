import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { SelectedSlotCard } from "~/features/reservations/components/SelectedSlot";
import { createReservation } from "~/features/reservations/api";
import { ApiError } from "~/lib/api/errors";

type ReservationConfirmState = {
  slotId: string;
  customerName: string;
  customerEmail: string;
  startAt?: string;
  endAt?: string;
};

export default function ReservationConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ReservationConfirmState | null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 直接アクセスされた場合
  if (!state?.slotId || !state.customerName || !state.customerEmail) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        予約情報がありません。予約情報入力画面からやり直してください。
        <button
          type="button"
          onClick={() => navigate("/reservations")}
          className="mt-3 block text-sm underline"
        >
          予約枠一覧へ戻る
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate(
      `/reservations/new?slotId=${state.slotId}`,
      {
        state: {
          customerName: state.customerName,
          customerEmail: state.customerEmail,
        },
      }
    );
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createReservation({
        slotId: state.slotId,
        customerName: state.customerName,
        customerEmail: state.customerEmail,
      });

      navigate("/reservations/complete", {
        state: {
          reservationId: response.id,
          customerName: response.customer_name,
          startAt: state.startAt,
          endAt: state.endAt,
        },
        replace: true,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("この予約枠はすでに予約済みです。予約枠一覧から別の枠を選択してください。");
        } else if (err.status === 422) {
          setError("予約情報に誤りがあります。入力内容を確認してください。");
        } else {
          setError("予約の登録に失敗しました。時間をおいて再度お試しください。");
        }
      } else {
        setError("通信エラーが発生しました。通信環境を確認して再度お試しください。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          予約内容確認
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          以下の内容で予約してよろしいですか？
        </p>
      </div>

      <SelectedSlotCard
        startAt={state.startAt}
        endAt={state.endAt}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          予約者情報
        </h2>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">氏名</dt>
            <dd className="mt-1 font-medium text-gray-800">
              {state.customerName}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">メールアドレス</dt>
            <dd className="mt-1 font-medium text-gray-800">
              {state.customerEmail}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          入力画面に戻る
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          {isSubmitting ? "予約を登録中..." : "予約を確定する"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="mt-3 rounded-md border border-red-300 bg-white px-4 py-2 font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            再試行する
          </button>
        </div>
      )}
    </div>
  );
}
