import { defineStore } from "pinia";
import http from "./http";
import { Response } from "@/types";
import { BoxInfo } from "./box";

export interface Camera {
  id: number;
  name: string;
  url: string;
  box: BoxInfo;
  detected: boolean;
  points: string;
}

export const useCameraStore = defineStore("camera", {
  state() {
    return {
      cameraList: [] as Camera[],
      cameraCur: {} as Camera,
    };
  },
  actions: {
    async fetchCameraList() {
      return http
        .request<Camera, Response<Camera[]>>("/camera", "GET")
        .then((res) => {
          if (res.code === 200) {
            this.cameraList = res.data.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            return res.data;
          }
          return Promise.reject(res);
        });
    },
    // async fetchApp(item_name: string) {
    //   return http
    //     .request<App, Response<App>>("/apps/item", "GET", {
    //       item_name,
    //     })
    //     .then((res) => {
    //       if (res.code === 200) {
    //         this.appCur = res.data;
    //         return res.data;
    //       }
    //       return Promise.reject(res);
    //     });
    // },
    async saveCamera(box_id: number, name: string, url: string, detected: boolean, points: string) {
      return http
        .request<Camera, Response<Camera>>("/camera", "post_json", {
          box_id,
          name,
          url,
          detected,
          points
        })
        .then(async (response) => {
          if (response.code === 201) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async updateCamera(id: number, name: string, url: string, detected: boolean, points: string) {
      return http
        .request<Camera, Response<Camera>>("/camera/" + id, "put_json", {
          name,
          url,
          detected,
          points
        })
        .then(async (response) => {
          if (response.code === 202) {
            return response;
          }
          return Promise.reject(response);
        });
    },
    async deleteCamera(id: number) {
      return http
        .request<Camera, Response<Camera>>("/camera/" + id, "DELETE", {})
        .then(async (response) => {
          if (response.code === 204) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
  },
});
