export type ReservationType = "confirmed" | "cancelled";

export interface Reservation {
  reservation_id: string;
  slot_id: string;
  customer_name: string;
  customer_email: string;
  user_id: string;
  status: ReservationType;
  created_at: string;
  start_at: string;
  end_at: string;
}
