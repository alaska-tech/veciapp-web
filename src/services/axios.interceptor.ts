import { JWT_KEY } from '@/constants/constants'
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const addJwtToHeader = (request: AxiosRequestConfig) => {
  const jwt = localStorage.getItem(JWT_KEY)
  if (jwt) {
    const newHeader = {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    }
    request.headers = newHeader
  }
  return request
}

const onRequest = (config: AxiosRequestConfig): any => {
  //el tipo correcto de retorno es AxiosRequestConfig, pero Axios me lo esta tomando como error
  const newConfig = addJwtToHeader(config)
  return newConfig
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 403) { //TODO: Comprobar que el error es 403 para cuando el usuario no tenga permisos
    localStorage.removeItem(JWT_KEY)
    window.location.href = '/'
  }
  return Promise.reject(error)
}

export function addJWTInterceptor(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)
  return axiosInstance
}
