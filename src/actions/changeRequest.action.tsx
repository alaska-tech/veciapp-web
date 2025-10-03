import { QueryKey, useQueryClient } from "@tanstack/react-query";
import {
  mutateEntity,
  queryEntity,
  queryEntityById,
  queryEntityWithParameters,
} from "./action";
import { AxiosError, AxiosResponse } from "axios";
import {
  BaseAttributes,
  ChangeRequest,
  PaginatedResult,
  Response,
} from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { ChangeEvent } from "react";

const CHANGE_REQUEST_QUERY_KEY = "change-requests";
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
          Extract<
            Response<PaginatedResult<ChangeRequest>>,
            { status: "Success" }
          >
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
          const response = await apiClient.post<
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
          const response = await apiClient.post<
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

  const getChangeRequstById = queryEntityById<
    ChangeRequest,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([CHANGE_REQUEST_QUERY_KEY] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<ChangeRequest>, { status: "Success" }>
        >(`/change-requests/${id}`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });

  const getChangeRequstByVendorId = queryEntityWithParameters<
    Extract<Response<PaginatedResult<ChangeRequest>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_CHANGE_REQUEST] as QueryKey, ({ ...search }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<ChangeRequest>>,
            { status: "Success" }
          >
        >("/change-requests", {
          params: { ...search },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });

  return {
    getChangeRequests,
    approveChangeRequest,
    rejectChangeRequest,
    getChangeRequstById,
    getChangeRequstByVendorId,
  };
};
