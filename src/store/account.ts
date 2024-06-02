import { defineStore } from "pinia";
import http from "./http";
import { Response } from "@/types";
// import jwtDecode from "jwt-decode";

export interface Profile {
  account: Account;
  permissions: string[];
  role: string;
}
export interface Account {
  name: string;
  email: string;
  phoneNumber: string;
  type: string;
  id: number;
  data: any;
  createdAt: string;
  updatedAt: string;
  disabled: boolean;
}

export type TokenResult = {
  id: number;
  email: string;
  name: string;
  type: string;
  access_token: string;
  refreshToken: string;
};

export const useAccountStore = defineStore("account", {
  state() {
    return {
      account: null as unknown as Account,
      permissions: [] as string[],
      role: "",
      logged: true,
    };
  },
  actions: {
    // async requestLogin(email: string) {
    //   return http
    //     .request<TokenResult, Response<TokenResult>>(
    //       "/request-login",
    //       "post_json",
    //       { email }
    //     )
    //     .then(async (response) => {
    //       if (response.code === 200) {
    //         return response.data;
    //       } else {
    //         return Promise.reject(response);
    //       }
    //     });
    // },
    async login(formData: URLSearchParams) {
      return http
        .request<TokenResult, Response<TokenResult>>(
          "/login",
          "post_json",
          formData
        )
        .then(async (response) => {
          if (response.code === 200) {
            console.log(response.data);
            this.logged = true;
            const token = response.data.access_token;
            // const decoded = jwtDecode(token) as { exp: number };
            // localStorage.setItem("account", JSON.stringify(decoded));
            // localStorage.setItem("refreshToken", response.data.refreshToken);
            http.setAuthorization(token);
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    // async login(email: string, password: string) {
    //   return http
    //     .request<TokenResult, Response<TokenResult>>("/login", "post_json", {
    //       email,
    //       password,
    //     })
    //     .then(async (response) => {
    //       if (response.code === 200) {
    //         this.logged = true;
    //         const token = response.data.token;
    //         const decoded = jwtDecode(token) as { exp: number };
    //         localStorage.setItem("account", JSON.stringify(decoded));
    //         localStorage.setItem("refreshToken", response.data.refreshToken);
    //         http.setAuthorization(token);
    //         return response.data;
    //       }
    //       return Promise.reject(response);
    //     });
    // },
    async register(name: string, email: string, password: string) {
      return http
        .request<TokenResult, Response<TokenResult>>("/users", "post_json", {
          name,
          email,
          password,
        })
        .then(async (response) => {
          if (response.code === 201) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async confirmRegister(token: string, email: string | null) {
      return http
        .request<TokenResult, Response<TokenResult>>(
          "/users/verify",
          "post_json",
          {
            token,
            email,
          }
        )
        .then(async (response) => {
          if (response.code === 200) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async requestResetPassword(email: string) {
      return http
        .request<TokenResult, Response<TokenResult>>(
          "/auth/forgot-password",
          "post_json",
          { email }
        )
        .then(async (response) => {
          if (response.code === 200) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async confirmResetPassword(token: string, email: string, password: string) {
      return http
        .request<TokenResult, Response<TokenResult>>(
          "/auth/reset-password",
          "put_json",
          {
            token,
            email,
            password,
          }
        )
        .then(async (response) => {
          if (response.code === 200) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        // clear local storage, except for the language
        localStorage.clear();

        http.removeAuthorization();
        this.logged = false;
        resolve(true);
      });
    },
    async profile() {
      return http
        .request<Account, Response<Account>>("/users/me", "get")
        .then((response) => {
          if (response.code === 200) {
            this.account = response.data;
            return response.data;
          } else {
            return Promise.reject(response);
          }
        });
    },
    // async updateProfile(account: Account) {
    //   return http
    //     .request<Account, Response<Account>>("/profile", "put_json", account)
    //     .then((response) => {
    //       if (response.code === 200) {
    //         this.account = response.data;
    //         return response.data;
    //       }
    //       return Promise.reject(response);
    //     });
    // },
    // setLogged(logged: boolean) {
    //   this.logged = logged;
    // },
    // async changePassword(oldPassword: string, newPassword: string) {
    //   return http
    //     .request<any, Response<any>>("/change-password", "post_json", {
    //       oldPassword,
    //       newPassword,
    //     })
    //     .then((response) => {
    //       if (response.code === 200) {
    //         return response.data;
    //       }
    //       return Promise.reject(response);
    //     });
    // },
    // async refreshToken() {
    //   return http
    //     .request<TokenResult, Response<TokenResult>>(
    //       "/refresh-token",
    //       "post_json",
    //       {
    //         refreshToken: localStorage.getItem("refreshToken"),
    //       }
    //     )
    //     .then(async (response) => {
    //       if (response.code === 200) {
    //         const token = response.data.token;
    //         const decoded = jwtDecode(token) as { exp: number };
    //         localStorage.setItem("account", JSON.stringify(decoded));
    //         localStorage.setItem("refreshToken", response.data.refreshToken);
    //         http.setAuthorization(token);
    //         return response.data;
    //       }
    //       return Promise.reject(response);
    //     });
    // },
  },
});