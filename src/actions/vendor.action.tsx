import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity, queryEntity } from "./action";
import { BaseAttributes, Response, Vendor } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey } from "@tanstack/react-query";

interface ValidateAccountForm {
  pass: string;
  code: string;
  hash: string;
}
export const QUERY_KEY_VENDOR = "vendor" as const;

export const useVendorAction = () => {
  const { notification, message } = App.useApp();
  const validateAccount = mutateEntity<
    AxiosResponse<Extract<Response<null>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: ValidateAccountForm }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<null>, { status: "Success" }>
          >(`/vendors/validate-email`, body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        const receivedErrorMessage = error.response?.data.error.message;
        notification.error({
          message: "Error",
          description: receivedErrorMessage,
          duration: 0,
        });
      },
      onSuccess(data, _variables, _context) {
        message.success({
          content: "Password asignado exitosamente",
          duration: 5,
        });
      },
    }
  );
  const getVendors = queryEntity<
    AxiosResponse<Extract<Response<Vendor[]>, { status: "Success" }>>["data"],
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_VENDOR + "s"] as QueryKey, async () => {
    try {
      const response = await apiClient.get<
        Extract<Response<Vendor[]>, { status: "Success" }>
      >("/vendors/list?limit=50&page=0");
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  const deleteVendor = mutateEntity<
    AxiosResponse<Extract<Response<null>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      id: string;
    }
  >(
    () => {
      return async function mutationFn({ id }) {
        try {
          if (!id) {
            throw new Error("No id provided");
          }
          const response = await apiClient.delete<
            Extract<Response<null>, { status: "Success" }>
          >("/vendors/delete/" + id);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, variables, context) => {
        if (error.code === "404") {
          notification.error({
            message: "Link no válido",
            description: error.response?.data.error.message || error.message,
            duration: 0,
          });
          return;
        }
        notification.error({
          message: "Error",
          description: error.response?.data.error.message || error.message,
          duration: 0,
        });
      },
      onSuccess(data, variables, context) {
        message.success({
          content: `Vendor was deleted successfully`,
          duration: 4,
        });
      },
    }
  );
  const createVendor = mutateEntity<
    AxiosResponse<Extract<Response<Vendor>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: Omit<Vendor, keyof BaseAttributes & "id"> }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<Vendor>, { status: "Success" }>
          >("/vendors", body);
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
        const vendor = data.data.data;
        message.success({
          content: `Vendor ${vendor.fullName || ""} ( ${
            vendor.email
          } ) was created successfully`,
          duration: 4,
        });
      },
    }
  );
  return { validateAccount, getVendors, deleteVendor, createVendor };
};
