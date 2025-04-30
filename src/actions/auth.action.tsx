import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { authClient } from "../services/clients";
import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity } from "./action";
import { message, notification } from "antd";
import { JWTKey, loggedUserInfoKey } from "@constants";
import { ErrorBody, User } from "@models";
import { LogInForm } from "@/pages";

export interface UpdatePasswordBody {
  password: string;
  confirm: string;
  token: string | string[] | undefined;
  onSuccess?: (response: AxiosResponse<User, any>) => void;
}
export type LogInResponse = {
  token: string;
  currentUser: User;
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
    AxiosResponse<LogInResponse>,
    AxiosError<ErrorBody>,
    { body: LogInForm }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await authClient.post<LogInResponse>(
            `/api/v1/auth/login`,
            body
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        const receivedErrorMessage = error.response?.data.message; //TODO: mapear
        notification.error({
          message: "Error",
          description: receivedErrorMessage || error.message,
          duration: 0,
        });
      },
      onSuccess(data, _variables, _context) {
        const { token, currentUser } = data.data;
        localStorage.setItem(JWTKey, JSON.stringify(token));
        localStorage.setItem(loggedUserInfoKey, JSON.stringify(currentUser));
        message.success({
          content: "Te logueaste correctamente",
          duration: 5,
        });
      },
    }
  );
  return { logOut, userSession, logIn };
}
