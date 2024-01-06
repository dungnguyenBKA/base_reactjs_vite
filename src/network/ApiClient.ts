import axios, { AxiosError, AxiosRequestConfig } from "axios";
import BaseResponse from "./models/BaseResponse";
import { errorLogger, requestLogger, responseLogger } from "./interceptors/Logger";
import AppConfig from "../shared/config/AppConfig";

export default class ApiClient {
  private static apiClient: ApiClient | undefined = undefined;

  public static getInstance(): ApiClient {
    if (!this.apiClient) {
      this.apiClient = new ApiClient();
    }
    return this.apiClient;
  }

  private axiosClient = axios.create({
    baseURL: AppConfig.baseURL,
    responseType: "json",
    timeout: 3000,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });

  private constructor() {
    this.setLoggerAxios();
  }

  private setLoggerAxios() {
    if (AppConfig.isProduction || true) {
      return;
    }

    this.axiosClient.interceptors.request.use(requestLogger, errorLogger);
    this.axiosClient.interceptors.response.use(responseLogger, errorLogger);
  }

  // method auth flow
  public updateAccessToken(token: string | undefined) {
    this.axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  public handleOnUnauthorized(onUnauthorized: () => void) {
    this.axiosClient.interceptors.response.use(
      config => {
        if (config.data?.code === 401 || config.status === 401) {
          onUnauthorized();
        }
        return config;
      },
      error => {
        if (error.isAxiosError) {
          console.error(error);
          if (error.response?.code === 401) {
            onUnauthorized();
          }
        } else {
          console.error("Not axios error", error);
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T, Data>(config: AxiosRequestConfig<Data>): Promise<BaseResponse<T>> {
    try {
      return (await this.axiosClient.request<BaseResponse<T>>(config)).data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          code: e.response?.data?.code || 600,
          message: e.message
        };
      }
      return {
        code: 600,
        message: "An error occurred"
      };
    }
  }

  post<T, Data = any>(url: string, data?: Data, config?: AxiosRequestConfig<Data>): Promise<BaseResponse<T>> {
    return this.request({
      ...config,
      url,
      data,
      method: "POST"
    });
  }

}
