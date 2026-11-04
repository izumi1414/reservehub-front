export type SlotStatus = "available" | "reserved";

export interface Slot {
  id: string;
  start_at: string;
  end_at: string;
  is_accepting: boolean;
  status: SlotStatus;
}

export interface CreateSlotRequest {
  startAt: string;
  endAt: string;
}

export interface UpdateSlotRequest {
  startAt: string;
  endAt: string;
  isAccepting: boolean;
}
