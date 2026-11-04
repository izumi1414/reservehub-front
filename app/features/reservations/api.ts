import { apiClient } from "~/lib/api/client";
import {
  type CreateReservationRequest,
  type CreateReservationResponse,
  type MyReservation,
  type CancelReservationResponse,
} from "./types";

export function createReservation(
  params: CreateReservationRequest
) {
  return apiClient.post<CreateReservationResponse>(
    "/api/reservations",
    params
  );
}

export function getMyReservations() {
  return apiClient.get<MyReservation[]>(
    "/api/reservations"
  )
}

export function cancelReservation(reservationId: string) {
  return apiClient.patch<CancelReservationResponse>(
    `/api/reservations/${reservationId}/cancel`
  );
}

export function getMyReservationById(reservationId: string) {
  return apiClient.get<MyReservation>(
    `/api/reservations/${reservationId}`
  )
}
