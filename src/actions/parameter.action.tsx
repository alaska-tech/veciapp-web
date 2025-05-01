import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { mutateEntity, queryEntity } from "./action";
import { AxiosError, AxiosResponse } from "axios";
import { BaseAttributes, ErrorBody, Parameter } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";

const QUERY_KEY = "parameters" as const;
export const useParameterAction = <T extends Parameter>() => {
  const queryClient = useQueryClient();
  const { notification, message } = App.useApp();
  const createParameter = mutateEntity<
    AxiosResponse<T>,
    AxiosError<ErrorBody>,
    { body: Omit<T, keyof BaseAttributes> }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<T>("/parameters", body);
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
          description: error.response?.data.message || error.message,
          duration: 0,
        });
      },
      onSuccess: async (data, variables, context) => {
        message.success({
          content: `Parameter ${
            data?.data.name || ""
          } was created successfully`,
          duration: 4,
        });
      },
    }
  );
  const getParameters = queryEntity<T[], AxiosError>(
    [QUERY_KEY + "s"] as QueryKey,
    async () => {
      try {
        const response = await apiClient.get<T[]>("/parameters/list?limit=10&page=0");
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  );
  return { createParameter, getParameters };
};
