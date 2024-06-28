import { defineStore } from "pinia";
import http from "./http";
import { Response } from "@/types";
import { Camera } from "./camera";

export interface Notification {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  status: string;
  created_at: string;
  camera: Camera;
}

export interface PaginationNotification {
  items: Notification[];
  page: number;
  size: number;
  total: number;
}

export const useNotificationStore = defineStore("notification", {
  state() {
    return {
      notificationList: [] as Notification[],
      notificationCur: {} as Notification,
      total: 0,
    };
  },
  actions: {
    async fetchNotificationList(page = 1, size = 6, camera_id = 0, start_date: undefined|string = undefined, end_date: undefined|string = undefined) {
      return http
        .request<PaginationNotification, Response<PaginationNotification>>(
          "/notifications",
          "GET",
          {
            page,
            size,
            camera_id,
            start_date,
            end_date
          }
        )
        .then((res) => {
          if (res.code === 200) {
            this.notificationList = res.data.items;
            this.total = res.data.total;
            return res.data;
          }
          return Promise.reject(res);
        });
    },
    async fetchNotificationById(id: string) {
      return http
        .request<Notification, Response<Notification>>(
          "/notifications/" + id,
          "GET",
        )
        .then((res) => {
          if (res.code === 200) {
            this.notificationCur = res.data;
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
        .request<Notification, Response<Notification>>(
          "/notifications",
          "put_json"
        )
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
