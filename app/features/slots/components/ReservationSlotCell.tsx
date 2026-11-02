import type { ReservationSlot } from "../types";

type ReservationSlotCellProps = {
  slot: ReservationSlot;
  onClick: (slot: ReservationSlot) => void;
};

export function ReservationSlotCell({
  slot,
  onClick,
}: ReservationSlotCellProps) {
  // 予約枠の状態を判定
  const isAvailable =
    slot.is_accepting && slot.status === "available";

  const isReserved = slot.status === "reserved";

  const isStopped = !slot.is_accepting;

  // 状態に応じた表示内容
  const cellStyle = isAvailable
    ? "bg-sky-100 text-sky-700 hover:bg-sky-200 cursor-pointer"
    : isReserved
      ? "bg-blue-600 text-white cursor-not-allowed"
      : isStopped
        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
        : "bg-gray-100 text-gray-500 cursor-not-allowed";

  const label = isAvailable
    ? "+ 空き"
    : isReserved
      ? "予約済み"
      : isStopped
        ? "受付停止"
        : "－";

  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={() => onClick(slot)}
      className={`
        w-full min-h-10 rounded-md
        text-sm font-medium
        transition-colors
        ${cellStyle}
      `}
    >
      {label}
    </button>
  );
}
