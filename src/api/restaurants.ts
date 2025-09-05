// src/api/restaurants.ts
import { api } from "./client";

export type RestaurantStatus = "pending" | "active" | "suspended" | "deleted";

export type Restaurant = {
  id: number;
  name: string;
  organization_id: number;
  version: string;
  status: RestaurantStatus;
  location?: string | null;
  phone?: string | null;
  created_at: string;
};

export type ListRestaurantsParams = {
  skip?: number; // default 0
  limit?: number; // default 50
  organization_id?: number; // filter by org
  include_deleted?: boolean; // include soft-deleted
  q?: string; // substring search by name
  status_in?: RestaurantStatus[]; // filter by multiple statuses
};

// LIST
export async function listRestaurants(params: ListRestaurantsParams = {}) {
  const { data } = await api.get<Restaurant[]>("/restaurants", {
    params,
    // axios ще сериализира масивите като status_in=active&status_in=pending
    // ако искаш друг формат, добави paramsSerializer
  });
  return data;
}

// GET ONE
export async function getRestaurant(id: number) {
  const { data } = await api.get<Restaurant>(`/restaurants/${id}`);
  return data;
}

// CREATE
export async function createRestaurant(payload: {
  name: string;
  organization_id: number;
  status?: RestaurantStatus; // по бекенд default: pending
  version?: string;
  location?: string | null;
  phone?: string | null;
}) {
  const { data } = await api.post<Restaurant>("/restaurants", payload);
  return data;
}

// UPDATE (partial/PATCH)
export async function updateRestaurant(
  id: number,
  payload: Partial<
    Pick<Restaurant, "name" | "status" | "location" | "phone" | "version">
  >
) {
  const { data } = await api.patch<Restaurant>(`/restaurants/${id}`, payload);
  return data;
}

// DELETE (soft delete в бекенда)
export async function deleteRestaurant(id: number) {
  await api.delete(`/restaurants/${id}`);
  return true;
}
