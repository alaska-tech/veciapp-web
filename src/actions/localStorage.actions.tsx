import { JWT_KEY, LOGGED_USER_INFO_KEY } from "@/constants/constants";
import { User, Response } from "@/constants/models";
import { apiClient } from "@/services/clients";
import { useMutation } from "@tanstack/react-query";

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

export const getUserInfo = (): User | null => {
  if (typeof window === "undefined") return null;
  const rawUserInfo = localStorage.getItem(LOGGED_USER_INFO_KEY) || "null";
  const userInfo = JSON.parse(rawUserInfo);
  return userInfo;
};

export const setUserInfo = (newUserInfo: User) => {
  if (typeof window === "undefined") return null;
  const stringifiedUserInfo = JSON.stringify(newUserInfo);
  return localStorage.setItem(JWT_KEY, stringifiedUserInfo);
};

export const clearAllInfoFromLocalStorage = () => {
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem(LOGGED_USER_INFO_KEY);
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

export const isTokenValid = (): boolean => {
  const token = getToken();
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
  const userInfo = getUserInfo();
  const currentRefreshToken = userInfo?.refreshToken || null;
  const mutation = useMutation({
    mutationFn: () => {
      return apiClient.post<Response<{ accessToken: string }>>(
        "/auth/refresh-token",
        {
          refreshToken: currentRefreshToken,
        }
      );
    },
    onSuccess: (data, _variables, _context) => {
      const accessToken = data.data.data?.accessToken || "";
      setToken(accessToken);
    },
  });
  function refreshCurrentToken() {
    if (isTokenValid()) {
      return;
    }
    mutation.mutate();
  }
  return { refreshCurrentToken };
};
