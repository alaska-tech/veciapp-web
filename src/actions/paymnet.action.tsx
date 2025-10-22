import { QueryKey, useQueryClient } from "@tanstack/react-query";
import {
  queryMultipleEntitiesById,
} from "./action";
import { AxiosError, AxiosResponse } from "axios";
import {
  Payment,
  Response,
} from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";

export const QUERY_KEY_PAYMENT = "payment" as const;
export const usePaymenAction = <T extends object>() => {
  const queryClient = useQueryClient();
  const { notification, message } = App.useApp();

  const getPaymentsByOrderId = queryMultipleEntitiesById<
    AxiosResponse<Extract<Response<Payment>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PAYMENT] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Payment>, { status: "Success" }>
        >(`payment/order/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    };
  });

  return {
    getPaymentsByOrderId,
  };
};
