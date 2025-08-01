import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntity,
  queryEntityById,
  queryEntityWithParameters,
  queryMultipleEntitiesById,
} from "./action";
import { BaseAttributes, PaginatedResult, Response, Customer, Vendor } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey } from "@tanstack/react-query";
import { QUERY_KEY_VENDOR } from "./vendor.action";

export const QUERY_KEY_CUSTOMER = "customer" as const;

export const useCustomerAction = () => {
  const { notification, message } = App.useApp();

  const getCustomers = queryEntityWithParameters<
    Extract<Response<PaginatedResult<Customer>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_CUSTOMER] as QueryKey, ({ ...search }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Customer>>, { status: "Success" }>
        >("/customers/list", {
          params: { ...search },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getCustomerById = queryEntityById<
    Customer,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_CUSTOMER] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Customer>, { status: "Success" }>
        >(`/customers/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const deleteCustomer = mutateEntity<
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
          >("/customers/delete/" + id);
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
          content: `Customer was deleted successfully`,
          duration: 4,
        });
      },
    }
  );
  const createCustomer = mutateEntity<
    AxiosResponse<Extract<Response<Customer>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: Omit<Customer, keyof BaseAttributes & "id"> }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<Customer>, { status: "Success" }>
          >("/customers", body);
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
        const customer = data.data.data;
        message.success({
          content: `Customer ${customer.fullName || ""} ( ${
            customer.email
          } ) was created successfully`,
          duration: 4,
        });
      },
    }
  );
  const updateCustomer = mutateEntity<
    AxiosResponse<Extract<Response<Customer>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: Omit<Customer, keyof BaseAttributes> }
  >(
    () => {
      return async function mutationFn({ body, id }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<Customer>, { status: "Success" }>
          >("/customers/edit/" + id, body);
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
        const customer = data.data.data;
        message.success({
          content: `Proveedor ${customer.fullName || ""} ( ${
            customer.email
          } ) se actualizó correctamente`,
          duration: 4,
        });
      },
    }
  );
  const validateAccount = mutateEntity<
    AxiosResponse<Extract<Response<null>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: { hash: string } }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<null>, { status: "Success" }>
          >(`/customers/validate-email`, body);
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
  const getCustomersById = queryMultipleEntitiesById<
    AxiosResponse<Extract<Response<Customer>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_CUSTOMER] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Customer>, { status: "Success" }>
        >(`/customers/get-details/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    };
  });
  return {
    getCustomers,
    getCustomerById,
    deleteCustomer,
    createCustomer,
    updateCustomer,
    validateAccount,
    getCustomersById,
  };
};
