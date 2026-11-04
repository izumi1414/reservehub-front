type CalendarHeaderProps = {
  dates: Date[];
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function CalendarHeader({ dates }: CalendarHeaderProps) {
  return (
    <>
      {/* 時刻列の空白 */}
      <div className="border-b border-gray-200 bg-gray-50" />

      {dates.map((date) => {
        const day = date.getDay();

        const isSaturday = day === 6;
        const isSunday = day === 0;

        const textColor = isSaturday
          ? "text-blue-600"
          : isSunday
            ? "text-red-500"
            : "text-gray-700";

        return (
          <div
            key={date.toISOString()}
            className="flex items-center justify-center border-b border-gray-200 bg-gray-50 py-3"
          >
            <span className={`text-sm font-semibold ${textColor}`}>
              {date.getMonth() + 1}/{date.getDate()} ({WEEKDAYS[day]})
            </span>
          </div>
        );
      })}
    </>
  );
}
