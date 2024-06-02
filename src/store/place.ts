import { defineStore } from "pinia";
import http from "./http";
import { Response } from "@/types";

export interface PLace {
  id: number;
  name: string;
  description: string;
}

export const usePlaceStore = defineStore("place", {
  state() {
    return {
      placeList: [] as PLace[],
      placeCur: {} as PLace,
    };
  },
  actions: {
    async fetchPlaceList() {
      return http
        .request<PLace, Response<PLace[]>>("/place", "GET")
        .then((res) => {
          if (res.code === 200) {
            this.placeList = res.data.sort((a, b) =>
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
    async savePlace(name: string, description: string) {
      return http
        .request<PLace, Response<PLace>>("/place", "post_json", {
          name,
          description,
        })
        .then(async (response) => {
          if (response.code === 201) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async updatePlace(id: number, name: string, description: string) {
      return http
        .request<PLace, Response<PLace>>("/place/" + id, "put_json", {
          name,
          description,
        })
        .then(async (response) => {
          if (response.code === 202) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async deletePlace(id: number) {
      return http
        .request<PLace, Response<PLace>>("/place/" + id, "DELETE", {})
        .then(async (response) => {
          if (response.code === 204) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
  },
});
