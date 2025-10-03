import { QueryKey, useQueryClient } from "@tanstack/react-query";
import {
  mutateEntity,
  queryEntity,
  queryEntityWithParameters,
} from "./action";
import { AxiosError, AxiosResponse } from "axios";
import { BaseAttributes, PaginatedResult, Response } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";

export interface ChangeRequest {
  id: string;
  vendorId: string;
  requestedChanges: {
    newValues: Record<string, any>;
    oldValues: Record<string, any>;
  };
  entityType: "STORE" | "VENDOR_PROFILE" | "PRODUCT_AND_SERVICE";
  entityId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminId: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}
export const QUERY_KEY_CHANGE_REQUEST = "changeRequests" as const;
export const useChangeRequestAction = () => {
  const queryClient = useQueryClient();
  const { notification, message } = App.useApp();


  const getChangeRequests = queryEntityWithParameters<
    Extract<Response<PaginatedResult<ChangeRequest>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_CHANGE_REQUEST] as QueryKey, ({ ...search }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<ChangeRequest>>, { status: "Success" }>
        >("/change-requests", {
          params: { ...search },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });

  const approveChangeRequest = mutateEntity<
    AxiosResponse<Extract<Response<ChangeRequest>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: { reason: string } }
  >(
    () => {
      return async function mutationFn({ id, body }) {
        try {
          if (!body || !id) {
            throw new Error("No body or id provided");
          }
          const response = await apiClient.put<
            Extract<Response<ChangeRequest>, { status: "Success" }>
          >(`/change-requests/${id}/approve`, body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, variables, context) => {
        notification.error({
          message: "Error",
          description: error.response?.data.error.message || error.message,
          duration: 0,
        });
      },
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_CHANGE_REQUEST],
        });
        message.success({
          content: "Solicitud aprovada correctamente",
          duration: 4,
        });
      },
    }
  );

  const rejectChangeRequest = mutateEntity<
    AxiosResponse<Extract<Response<ChangeRequest>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: { reason: string } }
  >(
    () => {
      return async function mutationFn({ id, body }) {
        try {
          if (!body || !id) {
            throw new Error("No body or id provided");
          }
          const response = await apiClient.put<
            Extract<Response<ChangeRequest>, { status: "Success" }>
          >(`/change-requests/${id}/reject`, body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, variables, context) => {
        notification.error({
          message: "Error",
          description: error.response?.data.error.message || error.message,
          duration: 0,
        });
      },
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_CHANGE_REQUEST],
        });
        message.success({
          content: "Solicitud rechazada correctamente",
          duration: 4,
        });
      },
    }
  );

  return { getChangeRequests, approveChangeRequest, rejectChangeRequest }
}
