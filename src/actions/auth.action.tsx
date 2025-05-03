import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiClient } from "../services/clients";
import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity } from "./action";
import { message, notification } from "antd";
import { JWTKey, loggedUserInfoKey } from "@constants";
import { User, Response } from "@models";
import { LogInForm } from "@/pages";

export interface UpdatePasswordBody {
  password: string;
  confirm: string;
  token: string | string[] | undefined;
  onSuccess?: (response: AxiosResponse<User, any>) => void;
}
export type LogInResponse = {
  token: string;
  user: User;
};
export default function useAuthAction() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userSession = useQuery<User | null>({
    queryKey: [loggedUserInfoKey],
    queryFn: () => {
      const loggedUserInfo = localStorage.getItem(loggedUserInfoKey);
      if (!loggedUserInfo) {
        return null;
      }
      return JSON.parse(loggedUserInfo) as User;
    },
  });
  const logOut = () => {
    localStorage.removeItem(JWTKey);
    localStorage.removeItem(loggedUserInfoKey);
    queryClient.removeQueries({ queryKey: [JWTKey] });
    queryClient.removeQueries({ queryKey: [loggedUserInfoKey] });
    router.push("/");
  };

  const logIn = mutateEntity<
    AxiosResponse<Extract<Response<LogInResponse>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: LogInForm }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<LogInResponse>, { status: "Success" }>
          >(`/auth/login`, body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        const receivedErrorMessage = error.response?.data.error.message; //TODO: mapear
        notification.error({
          message: "Error",
          description: receivedErrorMessage,
          duration: 0,
        });
      },
      onSuccess(data, _variables, _context) {
        const { token, user } = data.data.data;
        localStorage.setItem(JWTKey, JSON.stringify(token));
        localStorage.setItem(loggedUserInfoKey, JSON.stringify(user));
        message.success({
          content: "Te has logueado correctamente",
          duration: 5,
        });
      },
    }
  );
  return { logOut, userSession, logIn };
}
