export type ReservationSlot = {
  id: string;
  start_at: string;
  end_at: string;
  is_accepting: boolean;
  status: "available" | "reserved";
};
