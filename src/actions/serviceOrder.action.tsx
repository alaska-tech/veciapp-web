import { AxiosError } from "axios";
import { queryEntityWithParameters } from "./action";
import {
  PaginatedResult,
  Response,
  ServiceOrder,
  ServiceOrderOrderStatusType,
} from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey } from "@tanstack/react-query";

export const QUERY_KEY_SERVICE_ORDER = "serviceOrder" as const;
export interface PaginationParams {
  limit: number;
  page: number;
}
export interface ServiceOrderSearchParams extends PaginationParams {
  status?: ServiceOrderOrderStatusType[number];
}
export const useServiceOrderAction = () => {
  const { notification, message } = App.useApp();

  const getServiceOrders = queryEntityWithParameters<
    Extract<Response<PaginatedResult<ServiceOrder>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    ServiceOrderSearchParams
  >([QUERY_KEY_SERVICE_ORDER] as QueryKey, (search) => {
    return async function queryFn() {
      return {
        status: "Success",
        data: {
          data: [
            {
              id: "507f1f77bcf86cd799439015",
              orderNumber: "ORD-2024-001",
              customerId: "507f1f77bcf86cd799439012",
              vendorId: "20e83106-1f14-4311-8a71-392e68e92e61",
              branchId: "8c7d3856-6c83-4b58-a82e-5c5452c67d27",
              items: [
                {
                  productServiceId: "507f1f77bcf86cd799439014",
                  quantity: 2,
                  price: 25000,
                },
                {
                  productServiceId: "507f1f77bcf86cd799439016",
                  quantity: 1,
                  price: 15000,
                },
              ],
              deliveryAddress: "Calle 15 #23-45, Centro",
              deliveryType: "delivery",
              paymentMethod: "cash",
              totalAmount: 65000,
              notes: "Entregar en la puerta principal",
              orderStatus: "pending",
              paymentStatus: "pending",
              rating: 4.5,
              comment: "Excelente servicio",
              createdBy: "507f1f77bcf86cd799439010",
              createdAt: new Date("2024-01-01T10:00:00Z"),
              updatedBy: "507f1f77bcf86cd799439010",
              updatedAt: new Date("2024-01-15T14:20:00Z"),
              deletedAt: undefined,
            },
            {
              id: "507f1f77bcf86cd799439017",
              orderNumber: "ORD-2024-002",
              customerId: "507f1f77bcf86cd799439018",
              vendorId: "20e83106-1f14-4311-8a71-392e68e92e61",
              branchId: "8c7d3856-6c83-4b58-a82e-5c5452c67d27",
              items: [
                {
                  productServiceId: "507f1f77bcf86cd799439019",
                  quantity: 3,
                  price: 30000,
                },
              ],
              deliveryAddress: "Avenida 7 #12-34, Norte",
              deliveryType: "pickup",
              paymentMethod: "card",
              totalAmount: 90000,
              notes: "Recoger en mostrador",
              orderStatus: "confirmed",
              paymentStatus: "paid",
              rating: 5.0,
              comment: "Muy satisfecho con el servicio",
              createdBy: "507f1f77bcf86cd799439010",
              createdAt: new Date("2024-01-02T09:30:00Z"),
              updatedBy: "507f1f77bcf86cd799439010",
              updatedAt: new Date("2024-01-10T16:45:00Z"),
              deletedAt: undefined,
            },
            {
              id: "507f1f77bcf86cd799439020",
              orderNumber: "ORD-2024-003",
              customerId: "507f1f77bcf86cd799439021",
              vendorId: "99f646c1-f73e-4695-b9f3-ce020b2ed536",
              branchId: "507f1f77bcf86cd799439023",
              items: [
                {
                  productServiceId: "507f1f77bcf86cd799439024",
                  quantity: 1,
                  price: 45000,
                },
                {
                  productServiceId: "507f1f77bcf86cd799439025",
                  quantity: 2,
                  price: 20000,
                },
              ],
              deliveryAddress: "Carrera 8 #45-67, Sur",
              deliveryType: "delivery",
              paymentMethod: "transfer",
              totalAmount: 85000,
              notes: "Llamar antes de llegar",
              orderStatus: "in_progress",
              paymentStatus: "paid",
              rating: undefined,
              comment: undefined,
              createdBy: "507f1f77bcf86cd799439010",
              createdAt: new Date("2024-01-03T14:15:00Z"),
              updatedBy: "507f1f77bcf86cd799439010",
              updatedAt: new Date("2024-01-12T11:20:00Z"),
              deletedAt: undefined,
            },
            {
              id: "507f1f77bcf86cd799439026",
              orderNumber: "ORD-2024-004",
              customerId: "507f1f77bcf86cd799439027",
              vendorId: "20e83106-1f14-4311-8a71-392e68e92e61",
              branchId: "8c7d3856-6c83-4b58-a82e-5c5452c67d27",
              items: [
                {
                  productServiceId: "507f1f77bcf86cd799439028",
                  quantity: 1,
                  price: 75000,
                },
              ],
              deliveryAddress: "Calle 20 #10-30, Este",
              deliveryType: "delivery",
              paymentMethod: "cash",
              totalAmount: 75000,
              notes: "Entregar después de las 6 PM",
              orderStatus: "completed",
              paymentStatus: "paid",
              rating: 4.0,
              comment: "Buen servicio, llegó a tiempo",
              createdBy: "507f1f77bcf86cd799439010",
              createdAt: new Date("2024-01-04T11:00:00Z"),
              updatedBy: "507f1f77bcf86cd799439010",
              updatedAt: new Date("2024-01-08T18:30:00Z"),
              deletedAt: undefined,
            },
            {
              id: "507f1f77bcf86cd799439029",
              orderNumber: "ORD-2024-005",
              customerId: "507f1f77bcf86cd799439030",
              vendorId: "99f646c1-f73e-4695-b9f3-ce020b2ed536",
              branchId: "507f1f77bcf86cd799439023",
              items: [
                {
                  productServiceId: "507f1f77bcf86cd799439031",
                  quantity: 2,
                  price: 35000,
                },
              ],
              deliveryAddress: "Avenida 5 #25-15, Oeste",
              deliveryType: "pickup",
              paymentMethod: "card",
              totalAmount: 70000,
              notes: "Recoger en horario de atención",
              orderStatus: "cancelled",
              paymentStatus: "refunded",
              rating: undefined,
              comment: "Cancelado por el cliente",
              createdBy: "507f1f77bcf86cd799439010",
              createdAt: new Date("2024-01-05T08:45:00Z"),
              updatedBy: "507f1f77bcf86cd799439010",
              updatedAt: new Date("2024-01-06T10:15:00Z"),
              deletedAt: undefined,
            },
          ],
          meta: {
            total: 5,
            page: 0,
            limit: 10,
            lastPage: 1,
          },
        },
        error: null,
      };
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<ServiceOrder>>,
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
  return {
    getServiceOrders,
  };
};
