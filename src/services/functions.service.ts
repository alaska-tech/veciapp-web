import { succesResponse } from "@/constants/models";
import { apiClient } from "./clients";

export async function _post<E>(path: string, data: any) {
  return apiClient.post<succesResponse<E>>(path, data);
}

export async function _get(path: string) {
  return apiClient.get(path);
}

export async function _getSome<E>(path: string) {
  return apiClient.get<succesResponse<E[]>>(path);
}

export async function _getOne<E>(path: string) {
  return apiClient.get<succesResponse<E>>(path);
}

export async function _update(
  path: string,
  id: string,
  data: any,
) {
  return apiClient.put(`${path}/${id}`, data);
}

export async function _delete(
  path: string,
  id: string,
  version: number,
) {
  return apiClient.delete(`${path}/${id}/${version}`);
}
