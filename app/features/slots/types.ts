export type ReservationSlot = {
  id: number;
  start_at: string;
  end_at: string;
  is_accepting: boolean;
  status: "available" | "reserved";
};
