import { defineStore } from "pinia";
import http from "./http";
import { Response } from "@/types";

export interface Notification {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  status: string;
}

export const useNotificationStore = defineStore("notification", {
  state() {
    return {
      notificationList: [] as Notification[],
      notificationCur: {} as Notification,
    };
  },
  actions: {
    async fetchNotificationList() {
      return http
        .request<Notification, Response<Notification[]>>(
          "/notifications",
          "GET"
        )
        .then((res) => {
          if (res.code === 200) {
            this.notificationList = res.data;
            return res.data;
          }
          return Promise.reject(res);
        });
    },
    async fetchNotificationUnseenList() {
      return http
        .request<number, Response<number>>("/notifications/unseen", "GET")
        .then((res) => {
          if (res.code === 200) {
            return res.data;
          }
          return Promise.reject(res);
        });
    },
    // async savePlace(name: string, description: string) {
    //   return http
    //     .request<PLace, Response<PLace>>("/place", "post_json", {
    //       name,
    //       description,
    //     })
    //     .then(async (response) => {
    //       if (response.code === 201) {
    //         return response.data;
    //       }
    //       return Promise.reject(response);
    //     });
    // },
    async updateStatus() {
      return http
        .request<Notification, Response<Notification>>("/notifications", "put_json")
        .then(async (response) => {
          if (response.code === 202) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    // async deletePlace(id: number) {
    //   return http
    //     .request<PLace, Response<PLace>>("/place/" + id, "DELETE", {})
    //     .then(async (response) => {
    //       if (response.code === 204) {
    //         return response.data;
    //       }
    //       return Promise.reject(response);
    //     });
    // },
  },
});
