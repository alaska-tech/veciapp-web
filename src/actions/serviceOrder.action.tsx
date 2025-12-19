import { AxiosError } from "axios";
import { queryEntityById, queryEntityWithParameters } from "./action";
import {
  Branch,
  Customer,
  PaginatedResult,
  Response,
  ServiceOrder,
  ServiceOrderOrderStatusType,
  Vendor,
} from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey } from "@tanstack/react-query";
import { QUERY_KEY_PRODUCTSERVICE } from "./productservice.action";

export const QUERY_KEY_SERVICE_ORDER = "serviceOrder" as const;
export interface PaginationParams {
  limit: number;
  page: number;
}
export interface ServiceOrderSearchParams extends PaginationParams {
  orderStatus?: ServiceOrderOrderStatusType[number];
}
type GetServiceOrdersDataType = Omit<
  ServiceOrder,
  "branchId" | "vendorId" | "customerId"
> & {
  branch: Pick<Branch, "id" | "name" | "address">;
  vendor: Pick<Vendor, "id" | "email"> & { name: string };
  customer: Pick<Customer, "id" | "fullName" | "email" | "cellphone">;
};
export const useServiceOrderAction = () => {
  const { notification, message } = App.useApp();

  const getServiceOrders = queryEntityWithParameters<
    Extract<
      Response<PaginatedResult<GetServiceOrdersDataType>>,
      { status: "Success" }
    >,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    ServiceOrderSearchParams
  >([QUERY_KEY_SERVICE_ORDER] as QueryKey, (search) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<GetServiceOrdersDataType>>,
            { status: "Success" }
          >
        >("/orders/list", {
          params: search,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getServiceOrdersForVendor = queryEntityWithParameters<
    Extract<
      Response<
        PaginatedResult<GetServiceOrdersDataType>
      >,
      { status: "Success" }
    >,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_SERVICE_ORDER] as QueryKey, (search) => {
    return async function queryFn() {
      const { vendorId, ...rest } = search;
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<GetServiceOrdersDataType>>,
            { status: "Success" }
          >
        >(`/orders/vendor/${vendorId}`, {
          params: rest,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getServiceOrderById = queryEntityById<
    ServiceOrder,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<ServiceOrder>, { status: "Success" }>
        >(`/orders/get-detail/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  return {
    getServiceOrders,
    getServiceOrderById,
    getServiceOrdersForVendor,
  };
};
