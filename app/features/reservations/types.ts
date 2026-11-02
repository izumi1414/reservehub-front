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
