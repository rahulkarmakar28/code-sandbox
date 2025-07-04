import axios, { AxiosResponse } from "axios"

export const axiosInstance = axios.create();
export const apiConnector = async <T = any>(
  method: string,
  url: string,
  bodyData?: object,
  headers?: Record<string, string>,
  params?: Record<string, any>
): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    withCredentials: true,
    method,
    url,
    data: bodyData || undefined,
    headers: headers || undefined,
    params: params || undefined,
  });
};
