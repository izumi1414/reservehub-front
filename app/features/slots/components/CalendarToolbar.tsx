type CalendarToolbarProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

export function CalendarToolbar({
  currentDate,
  onDateChange,
}: CalendarToolbarProps) {
  // 表示開始日（月曜日）を取得
  const getWeekStart = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();

    // 月曜日始まりに調整
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);

    return result;
  };

  const weekStart = getWeekStart(currentDate);

  // 表示終了日（日曜日）を取得
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatDate = (date: Date) =>
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

  const changeWeek = (amount: number) => {
    const nextDate = new Date(weekStart);
    nextDate.setDate(nextDate.getDate() + amount * 7);
    onDateChange(nextDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          前週
        </button>

        <button
          type="button"
          onClick={() => changeWeek(1)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          次週
        </button>

        <button
          type="button"
          onClick={goToToday}
          className="rounded-md bg-sky-100 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-200"
        >
          今週
        </button>
      </div>

      <p className="text-sm font-semibold text-gray-700">
        {formatDate(weekStart)} ～ {formatDate(weekEnd)}
      </p>
    </div>
  );
}
