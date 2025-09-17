import { AxiosError } from "axios";
import {
  queryEntityWithParameters,
} from "./action";
import {
  PaginatedResult,
  Response,
} from "@models";
import { apiClient } from "@/services/clients";
import { QueryKey } from "@tanstack/react-query";

export const QUERY_KEY_VENDOR_STATISTIC = "vendorStatistic" as const;

export const useStatisticAction = () => {

  const getVendorStatistic = queryEntityWithParameters<
    Extract<Response<PaginatedResult<unknown>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >(
    [QUERY_KEY_VENDOR_STATISTIC] as QueryKey,
    ({ vendorId, search }) => {
      
      return async function queryFn() {
        try {
          const response = await apiClient.get<
            Extract<
              Response<PaginatedResult<unknown>>,
              { status: "Success" }
            >
          >(
            `/payment/dashboard/vendor/${vendorId}`
            , {
              params: {
                ...search,
              },
            });
          console.log(response);
          return response.data;
        } catch (error) {
          throw error;
        }
      };
    }
  );
  return {
    getVendorStatistic
  };
};
