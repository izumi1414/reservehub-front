import { apiClient } from "~/lib/api/client";
import type { Slot, CreateSlotRequest, UpdateSlotRequest } from "./types";

export function getSlotsList() {
  return apiClient.get<Slot[]>(
    "/api/admin/slots"
  )
};

export function getSlotById(id: string) {
  return apiClient.get<Slot>(
    `/api/admin/slots/${id}`
  )
}

export function createSlot(params: CreateSlotRequest) {
  return apiClient.post<Slot>(
    "/api/admin/slots",
    params
  )
}

export function updateSlot(id: string, params: UpdateSlotRequest) {
  return apiClient.patch<Slot>(
    `/api/admin/slots/${id}`,
    params
  )
}

export function deleteSlot(id: string) {
  return apiClient.delete(
    `/api/admin/slots/${id}`
  )
}
