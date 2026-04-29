import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntity,
  queryEntityById,
  queryEntityWithParameters,
  queryMultipleEntitiesById,
} from "./action";
import { BaseAttributes, PaginatedResult, Response, Vendor } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

interface ValidateAccountForm {
  pass: string;
  code: string;
  hash: string;
}
export const QUERY_KEY_VENDOR = "vendor" as const;

export const useVendorAction = () => {
  const { notification, message, modal } = App.useApp();
  const queryClient = useQueryClient();
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
  const getVendors = queryEntityWithParameters<
    Extract<Response<PaginatedResult<Vendor>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_VENDOR] as QueryKey, ({ limit, page, search }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Vendor>>, { status: "Success" }>
        >(`/vendors/list?limit=${limit}&page=${page}`, {
          params: {
            ...search,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getVendorById = queryEntityById<
    Vendor,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_VENDOR] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Vendor>, { status: "Success" }>
        >(`/vendors/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getVendorsById = queryMultipleEntitiesById<
    AxiosResponse<Extract<Response<Vendor>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_VENDOR] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Vendor>, { status: "Success" }>
        >(`/vendors/get-details/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    };
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
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_VENDOR] });
        message.success({
          content: `Vendor eliminado exitosamente`,
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
        const errorData = (error.response?.data as any)?.error;
        if (errorData?.code === "VENDOR_REACTIVATION_REQUIRED") return;
        const raw = errorData?.message || error.message || "";
        const isDuplicate = raw.toLowerCase().includes("duplicate key");
        notification.error({
          message: "Error al crear veci",
          description: isDuplicate
            ? "Ya existe un veci registrado con ese número de identificación o código interno. Verifica los datos e intenta de nuevo."
            : raw,
          duration: 0,
        });
      },
      onSuccess: async (data, variables, context) => {
        const vendor = data.data.data;
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_VENDOR] });
        message.success({
          content: `Veci ${vendor.fullName || ""} (${vendor.email}) creado exitosamente`,
          duration: 4,
        });
      },
    }
  );
  const updateVendor = mutateEntity<
    AxiosResponse<Extract<Response<Vendor>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: Omit<Vendor, keyof BaseAttributes> }
  >(
    () => {
      return async function mutationFn({ body, id }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<Vendor>, { status: "Success" }>
          >("/vendors/edit/" + id, body);
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
      },
    }
  );
  const reactivateVendor = mutateEntity<
    AxiosResponse<Extract<Response<{ id: string; message: string }>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: Omit<Vendor, keyof BaseAttributes & "id"> }
  >(
    () => {
      return async function mutationFn({ id, body }) {
        try {
          const response = await apiClient.put<
            Extract<Response<{ id: string; message: string }>, { status: "Success" }>
          >(`/vendors/reactivate/${id}`, body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error) => {
        notification.error({
          message: "Error al reactivar veci",
          description: error.response?.data.error.message || error.message,
          duration: 0,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_VENDOR] });
        message.success({ content: "Veci reactivado exitosamente", duration: 4 });
      },
    }
  );

  return {
    validateAccount,
    getVendors,
    getVendorById,
    deleteVendor,
    createVendor,
    updateVendor,
    getVendorsById,
    reactivateVendor,
  };
};
