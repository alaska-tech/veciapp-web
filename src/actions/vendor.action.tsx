import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity } from "./action";
import { Response } from "@models";
import { apiClient } from "@/services/clients";
import { App } from "antd";

interface ValidateAccountForm {
  pass: string;
  code: string;
  hash: string;
}
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
  return { validateAccount };
};
