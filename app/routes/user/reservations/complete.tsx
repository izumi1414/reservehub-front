import { Link, useLocation } from "react-router";

type ReservationCompleteState = {
  reservationId: string;
  customerName: string;
  startAt?: string;
  endAt?: string;
};

export default function ReservationCompletePage() {
  const location = useLocation();

  const state =
    location.state as ReservationCompleteState | null;

  const formatDate = (value?: string) => {
    if (!value) return "日時を取得できませんでした";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "日時を取得できませんでした";
    }

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
    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  if (!state?.reservationId) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-gray-800">
          予約完了情報がありません
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          予約確定後の画面からアクセスしてください。
          ブラウザを更新した場合はマイ予約一覧から予約内容をご確認ください。
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/my/reservations"
            className="rounded-md bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            予約一覧を見る
          </Link>
          <Link
            to="/reservations"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            予約枠一覧へ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
          <svg
            className="h-8 w-8 text-sky-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-800">
          予約が完了しました！
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          ご予約ありがとうございます。
          <br />
          予約内容はマイ予約一覧から確認できます。
        </p>

        {state && (
          <div className="mt-8 rounded-lg bg-sky-50 p-5 text-left">
            <h2 className="mb-3 text-sm font-semibold text-sky-700">
              予約内容
            </h2>

            <p className="font-semibold text-gray-800">
              {formatDate(state.startAt)}
            </p>

            <p className="mt-1 text-lg font-bold text-sky-700">
              {formatTime(state.startAt)} ～ {formatTime(state.endAt)}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/my/reservations"
            className="rounded-md bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            予約一覧を見る
          </Link>

          <Link
            to="/reservations"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            予約枠一覧へ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
