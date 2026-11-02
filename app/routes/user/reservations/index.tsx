import { useState } from "react";
import { ReservationCalendar } from
  "~/features/slots/components/ReservationCalendar";
import { useSlots } from "~/features/slots/useSlots";
import type { ReservationSlot } from "~/features/slots/types";

export default function ReservationListPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 表示週の月曜日を取得
  const day = currentDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() + diff);

  // APIに渡す日付（YYYY-MM-DD）
  const date = [
    startDate.getFullYear(),
    String(startDate.getMonth() + 1).padStart(2, "0"),
    String(startDate.getDate()).padStart(2, "0"),
  ].join("-");

  const { slots, isLoading, error } = useSlots(date);

  const handleSlotSelect = (slot: ReservationSlot) => {
    console.log("選択した予約枠:", slot);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          予約枠一覧
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          ご希望の日程を選択してください。
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-500">予約枠を読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ReservationCalendar
          slots={slots}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onSlotSelect={handleSlotSelect}
        />
      )}
    </div>
  );
}
