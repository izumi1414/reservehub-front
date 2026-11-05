import { apiClient } from "~/lib/api/client";
import type { Reservation } from "./types";

export function getReservationsForAdmin() {
  return apiClient.get<Reservation[]>(
    "/api/admin/reservations"
  )
}

export function getReservationDetailForAdmin(id: string) {
  return apiClient.get<Reservation>(
    `/api/admin/reservations/${id}`
  )
}
