import { AxiosError } from "axios";
import { queryEntityWithParameters } from "./action";
import { Response } from "@models";
import { apiClient } from "@/services/clients";
import { QueryKey } from "@tanstack/react-query";

export const QUERY_KEY_VENDOR_STATISTIC = "vendorStatistic" as const;

interface Transaction {
  id: string;
  amount: number;
  state: string;
  provider: string;
  type: string;
  createdAt: string;
}

interface VendorSummary {
  totalSales: number;
  salesToday: number;
  salesLast7Days: number;
}

interface VendorDashboardResponse {
  summary: VendorSummary;
  recentTransactions?: Transaction[];
}

export const useStatisticAction = () => {
  const getVendorStatistic = queryEntityWithParameters<
    Extract<Response<VendorDashboardResponse>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >(
    [QUERY_KEY_VENDOR_STATISTIC] as QueryKey,
    ({ vendorId }) => {
      return async function queryFn() {
        try {
          const response = await apiClient.get<
            Extract<Response<VendorDashboardResponse>, { status: "Success" }>
          >(`/payments/dashboard/vendor/${vendorId}`);
          return response.data;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchInterval: 1000 * 60 * 5, // Refresca cada 5 minutos
    }
  );

  return {
    getVendorStatistic,
  };
};
