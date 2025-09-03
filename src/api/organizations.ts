// src/api/organizations.ts
import { api } from "./client";

export type Organization = {
  id: number;
  name: string;
  version: number;
  status: "pending" | "active" | "suspended" | "deleted";
  created_at: string;
};

// LIST
export async function listOrganizations() {
  const { data } = await api.get<Organization[]>("/organizations");
  return data;
}

// CREATE
export async function createOrganization(payload: {
  name: string;
  version?: number;
  status?: Organization["status"];
}) {
  const { data } = await api.post<Organization>("/organizations", payload);
  return data;
}

// UPDATE (partial update – същото като PATCH при бекенда)
export async function updateOrganization(
  id: number,
  payload: Partial<Pick<Organization, "name" | "version" | "status">>
) {
  const { data } = await api.patch<Organization>(
    `/organizations/${id}`,
    payload
  );
  return data;
}

// DELETE
export async function deleteOrganization(id: number) {
  await api.delete(`/organizations/${id}`);
  return true;
}
