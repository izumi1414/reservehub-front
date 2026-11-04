import { useMemo } from "react";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarLegend } from "./CalendarLegend";
import { CalendarGrid } from "./CalendarGrid";
import type { ReservationSlot } from "../types";

type ReservationCalendarProps = {
  slots: ReservationSlot[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSlotSelect: (slot: ReservationSlot) => void;
};

export function ReservationCalendar({
  slots,
  currentDate,
  onDateChange,
  onSlotSelect,
}: ReservationCalendarProps) {
  // 月曜日始まりの7日間を生成
  const dates = useMemo(() => {
    const startDate = new Date(currentDate);
    const day = startDate.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    startDate.setDate(startDate.getDate() + diff);
    startDate.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date;
    });
  }, [currentDate]);

  return (
    <div className="space-y-5">
      <CalendarToolbar
        currentDate={currentDate}
        onDateChange={onDateChange}
      />

      <CalendarLegend />

      <CalendarGrid
        dates={dates}
        slots={slots}
        onSlotSelect={onSlotSelect}
      />
    </div>
  );
}
