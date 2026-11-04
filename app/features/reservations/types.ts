export type CreateReservationRequest = {
  slotId: string;
  customerName: string;
  customerEmail: string;
};

export type CreateReservationResponse = {
  id: string;
  slot_id: string;
  customer_name: string;
  customer_email: string;
  status: "confirmed";
  created_at: string;
  user_id: string;
};

export type MyReservation = {
  reservation_id: string;
  slot_id: string;
  customer_name: string;
  customer_email: string;
  user_id: string;
  status: string;
  created_at: string;
  start_at: string;
  end_at: string;
};

export type CancelReservationResponse = {
  id: string;
  slot_id: string;
};
