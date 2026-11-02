type SelectedSlotCardProps = {
  startAt: string;
  endAt: string;
};

export function SelectedSlotCard({
  startAt,
  endAt,
}: SelectedSlotCardProps) {
  const formatDate = (value: string) => {
    const date = new Date(value);

    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    }).format(date);
  };

  const formatTime = (value: string) => {
    const date = new Date(value);

    return new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-sky-700">
          選択した予約枠
        </span>
      </div>

      <p className="text-lg font-bold text-gray-800">
        {formatDate(startAt)}
      </p>

      <p className="mt-1 text-xl font-bold text-sky-700">
        {formatTime(startAt)} ～ {formatTime(endAt)}
      </p>
    </div>
  );
}
