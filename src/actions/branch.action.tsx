import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntity,
  queryEntityById,
  queryEntityWithParameters,
  queryMultipleEntitiesById,
} from "./action";
import { BaseAttributes, PaginatedResult, Response, Branch } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const QUERY_KEY_BRANCH = "branch" as const;

export const useBranchAction = () => {
  const { notification, message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const getBranchs = queryEntity<
    AxiosResponse<
      Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
    >["data"],
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH + "s"] as QueryKey, async () => {
    try {
      const response = await apiClient.get<
        Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
      >("/branches/list?limit=50&page=0");
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  const getBranchById = queryEntityById<
    Branch,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Branch>, { status: "Success" }>
        >(`/branches/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getBranchesById = queryMultipleEntitiesById<
    AxiosResponse<Extract<Response<Branch>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Branch>, { status: "Success" }>
        >(`/branches/get-details/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    };
  });
  const getBranchesByVendorId = queryEntityById<
    PaginatedResult<Branch>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
        >(`/branches/${id}/all-branches?limit=10&page=1`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getBranchesPaginated = queryEntityWithParameters<
    Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, ({ limit, page, search }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
        >(`/branches/all?limit=${limit}&page=${page}`, {
          params: {
            ...search,
          },
        });
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getBranchesByVendorIdPaginated = queryEntityWithParameters<
    Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, ({ limit, page, vendorId, search }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
        >(`/branches/${vendorId}/all-branches?limit=${limit}&page=${page}`, {
          params: {
            ...search,
          },
        });
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const deleteBranch = mutateEntity<
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
          >("/branches/delete/" + id);
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
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_BRANCH] });

        message.success({
          content: `Branch was deleted successfully`,
          duration: 4,
        });
      },
    }
  );
  const createBranch = mutateEntity<
    AxiosResponse<Extract<Response<Branch>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: Omit<Branch, keyof BaseAttributes & "id">; vendorId: string }
  >(
    () => {
      return async function mutationFn({ body, vendorId }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<Branch>, { status: "Success" }>
          >("/branches/" + vendorId + "/new-branch", body);
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
        const branch = data.data.data;
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_BRANCH] });
        
      },
    }
  );
  const updateBranch = mutateEntity<
    AxiosResponse<Extract<Response<Branch>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { id: string; body: Omit<Branch, keyof BaseAttributes> }
  >(
    () => {
      return async function mutationFn({ body, id }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<Branch>, { status: "Success" }>
          >("/branches/edit/" + id, body);
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
        const branch = data.data.data;
      },
    }
  );
  return {
    getBranchs,
    getBranchById,
    deleteBranch,
    createBranch,
    updateBranch,
    getBranchesByVendorId,
    getBranchesById,
    getBranchesByVendorIdPaginated,
    getBranchesPaginated,
  };
};
