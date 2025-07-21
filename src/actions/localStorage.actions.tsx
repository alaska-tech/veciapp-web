import {
  JWT_KEY,
  LOGGED_USER_INFO_KEY,
  REFRESH_JWT_KEY,
} from "@/constants/constants";
import { User, Response } from "@/constants/models";
import { apiClient } from "@/services/clients";
import { useMutation } from "@tanstack/react-query";
import { mutateEntity } from "./action";
import { AxiosError, AxiosResponse } from "axios";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const MIN_REMAINING_HOURS = 24;

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(JWT_KEY);
};

export const setToken = (newToken: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.setItem(JWT_KEY, newToken);
};
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_JWT_KEY);
};

export const setRefreshToken = (newRefreshToken: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.setItem(REFRESH_JWT_KEY, newRefreshToken);
};

export const clearRefreshToken = () => {
  localStorage.removeItem(REFRESH_JWT_KEY);
};
export const getUserInfo = (): User | null => {
  if (typeof window === "undefined") return null;
  const rawUserInfo = localStorage.getItem(LOGGED_USER_INFO_KEY) || "null";
  const userInfo = JSON.parse(rawUserInfo);
  return userInfo;
};

export const setUserInfo = (newUserInfo: User) => {
  if (typeof window === "undefined") return null;
  const stringifiedUserInfo = JSON.stringify(newUserInfo);
  return localStorage.setItem(LOGGED_USER_INFO_KEY, stringifiedUserInfo);
};

export const clearAllInfoFromLocalStorage = () => {
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem(LOGGED_USER_INFO_KEY);
  localStorage.removeItem(REFRESH_JWT_KEY);
};
const decodeToken = (token: string): DecodedToken => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  try {
    const decodedToken = decodeToken(token);
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const remainingTime = expirationTime - currentTime;
    const remainingHours = remainingTime / (1000 * 60 * 60);

    return remainingHours >= MIN_REMAINING_HOURS;
  } catch (error) {
    return false;
  }
};
export const useLocalStorageAction = () => {

  const refresh = mutateEntity<
    AxiosResponse<
      Extract<
        Response<{ message: string; accessToken: string }>,
        { status: "Success" }
      >
    >,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: { refreshToken: string } }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<
              Response<{ message: string; accessToken: string }>,
              { status: "Success" }
            >
          >("/auth/refresh-token", body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onSuccess: async (data, variables, context) => {
        const accessToken = data.data?.data?.accessToken || "";
        setToken(accessToken);
        clearRefreshToken(); //TODO: preguntar cuantas veces sirve ese token
      },
    }
  );
  const refreshMutation = refresh();
  function refreshCurrentToken() {
    const token = getToken();
    if (token && isTokenValid(token)) {
      return;
    }

    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      return;
    }
    try {
      refreshMutation.mutate({ body: { refreshToken: currentRefreshToken } });
    } catch (error) {
      console.error("Error refreshing token", error);
    }
  }
  return { refreshCurrentToken };
};
