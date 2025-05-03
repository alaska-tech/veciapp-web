import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { mutateEntity, queryEntity } from "./action";
import { AxiosError, AxiosResponse } from "axios";
import { BaseAttributes, Parameter, Response } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";

const QUERY_KEY = "parameters" as const;
export const useParameterAction = <T extends object>() => {
  const queryClient = useQueryClient();
  const { notification, message } = App.useApp();
  const createParameter = mutateEntity<
    AxiosResponse<Extract<Response<Parameter>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: Omit<T, keyof BaseAttributes> }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<Parameter>, { status: "Success" }>
          >("/parameters", body);
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
      onSuccess: async (data, variables, context) => {
        message.success({
          content: `Parameter ${
            data?.data.data.displayName || ""
          } was created successfully`,
          duration: 4,
        });
      },
    }
  );
  interface PaginatedResult<T> {
    parameters: T[];
    count: number;
  }
  const getParameters = queryEntity<
    AxiosResponse<
      Extract<Response<PaginatedResult<Parameter>>, { status: "Success" }>
    >["data"],
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY + "s"] as QueryKey, async () => {
    try {
      const response = await apiClient.get<
        Extract<Response<PaginatedResult<Parameter>>, { status: "Success" }>
      >("/parameters/list?limit=50&page=0");
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  const updateParameter = mutateEntity<
    AxiosResponse<Extract<Response<Parameter>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: Partial<Parameter> }
  >(
    () => {
      return async function mutationFn({ id, body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<Parameter>, { status: "Success" }>
          >(`/parameters/${id}`, body);
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
        queryClient.setQueryData([QUERY_KEY, variables.id], data.data.data);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY, variables.id],
        });
        message.success({
          content: "Parámetro actualizado correctamente",
          duration: 4,
        });
      },
    }
  );

  return { createParameter, getParameters, updateParameter };
};
