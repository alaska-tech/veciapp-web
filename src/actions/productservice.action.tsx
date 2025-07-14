import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntity,
  queryEntityById,
  queryEntityWithParameters,
} from "./action";
import {
  BaseAttributes,
  PaginatedResult,
  Response,
  ProductService,
} from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryClient, QueryKey, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY_BRANCH } from "./branch.action";

export const QUERY_KEY_PRODUCTSERVICE = "productService" as const;

export const useProductServiceAction = () => {
  const { notification, message } = App.useApp();
  const queryClient = useQueryClient();
  const getProductServices = queryEntity<
    AxiosResponse<
      Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>
    >["data"],
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE] as QueryKey, async () => {
    try {
      const response = await apiClient.get<
        Extract<
          Response<PaginatedResult<ProductService>>,
          { status: "Success" }
        >
      >("/productservice/list?limit=50&page=0");
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  const getProductServicesPaginated = queryEntityWithParameters<
    Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE] as QueryKey, ({ limit, page, branchId }) => {
    return async function queryFn() {
      try {
        const branch = branchId ? `&branchId=${branchId}` : "";
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<ProductService>>,
            { status: "Success" }
          >
        >(`/productservice/list?limit=${limit}&page=${page}${branch}`);
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getProductServicesByBranchId = queryEntityById<
    Extract<Response<PaginatedResult<ProductService>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCTSERVICE, QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<ProductService>>,
            { status: "Success" }
          >
        >(`/productservice/list?limit=50&page=0&branchId=${id}`);
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
          Extract<Response<{ data: ProductService }>, { status: "Success" }>
        >(`/productservice/get-details/${id}`);
        console.log(response);
        return response.data.data.data;
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
          >("/productservice/delete/" + id);
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
  const uploadPicture = mutateEntity<
    AxiosResponse<Extract<Response<string>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: any;
    }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const formData = new FormData();
          formData.append("file", body);

          const response = await apiClient.post<
            Extract<Response<string>, { status: "Success" }>
          >("/productservice/upload-picture", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
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
          content: `Picture uploaded successfully`,
          duration: 4,
        });
      },
    }
  );
  const createProductService = mutateEntity<
    AxiosResponse<Extract<Response<ProductService>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: Omit<ProductService, keyof BaseAttributes & "id">;
      userId: string;
      branchId: string;
    }
  >(
    () => {
      return async function mutationFn({ body, userId: vendorId, branchId }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<ProductService>, { status: "Success" }>
          >("/productservice", {
            ...body,
            vendorId,
            branchId,
            currency: "COP",
          });
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
          content: `ProductService ${
            productService.name || ""
          } was created successfully`,
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
          >("/productservice/update/" + id, body);
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
          content: `Producto o servicio ${
            productService.name || ""
          } se actualizó correctamente`,
          duration: 4,
        });
      },
    }
  );
  const updateProductServiceState = mutateEntity<
    AxiosResponse<Extract<Response<ProductService>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: { state: string; updatedBy: string } }
  >(
    () => {
      return async function mutationFn({ body, id }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<ProductService>, { status: "Success" }>
          >("/productservice/state/update/" + id, body);
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
          content: `Producto o servicio ${
            productService.name || ""
          } se actualizó correctamente`,
          duration: 4,
        });
      },
    }
  );
  const updateProductServiceInventory = mutateEntity<
    AxiosResponse<Extract<Response<ProductService>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      id: string;
      body: {
        quantity: number;
        action: "addition" | "subtraction";
        updatedBy: string;
      };
    }
  >(
    () => {
      return async function mutationFn({ body, id }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<ProductService>, { status: "Success" }>
          >("/productservice/inventory/update/" + id, body);
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
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PRODUCTSERVICE] });
        const productService = data.data.data;
        message.success({
          content: `Producto o servicio ${
            productService.name || ""
          } se actualizó correctamente`,
          duration: 4,
        });
      },
    }
  );
  return {
    getProductServices,
    getProductServiceById,
    getProductServicesByBranchId,
    deleteProductService,
    createProductService,
    updateProductService,
    uploadPicture,
    updateProductServiceState,
    updateProductServiceInventory,
    getProductServicesPaginated,
  };
};
