import { apiClient } from "~/lib/api/client";
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from "./types";

export function createReservation(
  params: CreateReservationRequest
) {
  return apiClient.post<CreateReservationResponse>(
    "/api/reservations",
    params
  );
}
