import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity, queryEntity, queryEntityById } from "./action";
import { BaseAttributes, PaginatedResult, Response, ProductService } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey } from "@tanstack/react-query";
import { QUERY_KEY_BRANCH } from "./branch.action";

export const QUERY_KEY_PRODUCTSERVICE = "productService" as const;

export const useProductServiceAction = () => {
  const { notification, message } = App.useApp();

  const getProductServices = queryEntity<
    AxiosResponse<
      Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>
    >["data"],
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE + "s"] as QueryKey, async () => {
    try {
      const response = await apiClient.get<
        Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>
      >("/productService/list?limit=50&page=0");
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  const getProductServicesByBranchId = queryEntityById<
    Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE, QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>
        >(`/productService/list?limit=50&page=0&branchId=${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getProductServiceById = queryEntityById<
    ProductService,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<ProductService>, { status: "Success" }>
        >(`/productServicees/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const deleteProductService = mutateEntity<
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
          >("/productServicees/delete/" + id);
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
          content: `ProductService was deleted successfully`,
          duration: 4,
        });
      },
    }
  );
  const createProductService = mutateEntity<
    AxiosResponse<Extract<Response<ProductService>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: Omit<ProductService, keyof BaseAttributes & "id">; vendorId: string }
  >(
    () => {
      return async function mutationFn({ body, vendorId }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<ProductService>, { status: "Success" }>
          >("/productService", body);
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
        const productService = data.data.data;
        message.success({
          content: `ProductService ${productService.name || ""} was created successfully`,
          duration: 4,
        });
      },
    }
  );
  const updateProductService = mutateEntity<
    AxiosResponse<Extract<Response<ProductService>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: Omit<ProductService, keyof BaseAttributes> }
  >(
    () => {
      return async function mutationFn({ body, id }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<ProductService>, { status: "Success" }>
          >("/productService/update" + id, body);
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
        const productService = data.data.data;
        message.success({
          content: `Proveedor ${productService.name || ""} se actualizó correctamente`,
          duration: 4,
        });
      },
    }
  );
  return {
    getProductServices,
    getProductServiceById,getProductServicesByBranchId,
    deleteProductService,
    createProductService,
    updateProductService,
  };
};
