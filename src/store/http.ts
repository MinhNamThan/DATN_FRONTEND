import { AxiosRequestConfig, AxiosResponse } from "axios";
import createHttp from "@/utils/axiosHttp";
import { isResponse } from "@/types";
import NProgress from "nprogress";

const http = createHttp({
  timeout: 10000,
  baseURL: process.env.VUE_APP_API_URL,
});

const isAxiosResponse = (obj: any): obj is AxiosResponse => {
  return (
    typeof obj === "object" &&
    obj.status &&
    obj.statusText &&
    obj.headers &&
    obj.config
  );
};

http.interceptors.request.use((req: AxiosRequestConfig) => {
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  const token = localStorage.getItem("Authorization");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

http.interceptors.response.use(
  (rep: AxiosResponse<String>) => {
    const { data } = rep;
    if (isResponse(data)) {
      if (data.code === 0) {
        return rep; // Return the entire Axios response object
      } else {
        return Promise.reject(data);
      }
    } else {
      return Promise.reject({
        message: rep.statusText,
        code: rep.status,
        data
      });
    }
  },
  (error) => {
    if (error.response && isAxiosResponse(error.response)) {
      if (error.response.status === 401) {
        localStorage.clear();

        http.removeAuthorization();
        window.location.href = "/";
      }

      return Promise.reject({
        message: error.response.statusText,
        code: error.response.status,
        data: error.response.data,
      });
    }

    return Promise.reject(error);
  }
);

// progress 进度条 -- 关闭
http.interceptors.response.use(
  (rep) => {
    if (NProgress.isStarted()) {
      NProgress.done();
    }
    return rep;
  },
  (error) => {
    if (NProgress.isStarted()) {
      NProgress.done();
    }
    return error;
  }
);

export default http;
