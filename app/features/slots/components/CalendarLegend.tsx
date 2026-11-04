const LEGEND_ITEMS = [
  {
    label: "予約可能",
    color: "bg-sky-100",
    border: "border-sky-200",
  },
  {
    label: "予約済み",
    color: "bg-blue-600",
    border: "border-blue-600",
  },
  {
    label: "受付停止",
    color: "bg-gray-200",
    border: "border-gray-300",
  },
  {
    label: "予約枠なし",
    color: "bg-gray-100",
    border: "border-gray-200",
  },
];

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={`h-4 w-4 rounded ${item.color} border ${item.border}`}
          />
          <span className="text-sm text-gray-600">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
