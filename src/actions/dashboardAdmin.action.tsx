import { AxiosError } from "axios";
import { queryEntity } from "./action";
import { Response } from "@models";
import { apiClient } from "@/services/clients";
import { QueryKey } from "@tanstack/react-query";

export const QUERY_KEY_DASHBOARD_ADMIN = "dashboardAdmin" as const;

export interface AdminDashboardStats {
  vendors: { total: number; active: number; verified_pending: number };
  customers: { total: number; active: number };
  branches: { total: number; active: number };
  orders: { total: number; pending: number; completed: number; revenue: string };
}

export const useDashboardAdminAction = () => {
  const getDashboardStats = queryEntity<
    Extract<Response<AdminDashboardStats>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >(
    [QUERY_KEY_DASHBOARD_ADMIN] as QueryKey,
    async () => {
      const response = await apiClient.get<
        Extract<Response<AdminDashboardStats>, { status: "Success" }>
      >("/dashboard-admin/stats");
      return response.data;
    }
  );

  return { getDashboardStats };
};
