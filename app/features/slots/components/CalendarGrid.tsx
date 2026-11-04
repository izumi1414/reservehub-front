import { CalendarHeader } from "./CalendarHeader";
import { ReservationSlotCell } from "./ReservationSlotCell";
import type { ReservationSlot } from "../types";

type CalendarGridProps = {
  dates: Date[];
  slots: ReservationSlot[];
  onSlotSelect: (slot: ReservationSlot) => void;
};

// 表示する時間帯（9:00〜18:00）
const HOURS = Array.from({ length: 10 }, (_, index) => index + 9);

export function CalendarGrid({
  dates,
  slots,
  onSlotSelect,
}: CalendarGridProps) {
  // 日付と時間から予約枠を検索
  const findSlot = (date: Date, hour: number) => {
    return slots.find((slot) => {
      const startAt = new Date(slot.start_at);

      return (
        startAt.getFullYear() === date.getFullYear() &&
        startAt.getMonth() === date.getMonth() &&
        startAt.getDate() === date.getDate() &&
        startAt.getHours() === hour
      );
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="min-w-[900px]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "80px repeat(7, minmax(0, 1fr))",
          }}
        >
          {/* 日付ヘッダー */}
          <CalendarHeader dates={dates} />

          {/* 時間帯ごとの行 */}
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              {/* 時間表示 */}
              <div className="flex items-center justify-center border-b border-r border-gray-200 bg-gray-50 py-2 text-sm text-gray-600">
                {hour}:00
              </div>

              {/* 7日分の予約枠 */}
              {dates.map((date) => {
                const slot = findSlot(date, hour);

                return (
                  <div
                    key={`${date.toISOString()}-${hour}`}
                    className="border-b border-r border-gray-200 p-1"
                  >
                    {slot ? (
                      <ReservationSlotCell
                        slot={slot}
                        onClick={onSlotSelect}
                      />
                    ) : (
                      <div className="flex min-h-10 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
                        －
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
