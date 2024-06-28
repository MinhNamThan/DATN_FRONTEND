import { defineStore } from "pinia";
import http from "./http";
import { Response } from "@/types";
import { PLace } from "./place";

export interface Box {
  id: number;
  name: string;
  link: string;
  username: string;
  password: string;
  place_id: number
}

export interface BoxInfo {
  id: number;
  name: string;
  link: string;
  username: string;
  password: string;
  place: PLace
}

export const useBoxStore = defineStore("box", {
  state() {
    return {
      boxList: [] as Box[],
      boxCur: {} as Box,
    };
  },
  actions: {
    async fetchBoxList() {
      return http
        .request<Box, Response<Box[]>>("/box", "GET")
        .then((res) => {
          if (res.code === 200) {
            this.boxList = res.data.sort((a, b) =>
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
    async saveBox(place_id: number, name: string, link: string, username: string, password: string) {
      return http
        .request<Box, Response<Box>>("/box", "post_json", {
          place_id,
          name,
          link,
          username,
          password,
        })
        .then(async (response) => {
          if (response.code === 201) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async updateBox(id: number, name: string, link: string, username: string, password: string) {
      return http
        .request<Box, Response<Box>>("/box/" + id, "put_json", {
          name,
          link,
          username,
          password,
        })
        .then(async (response) => {
          if (response.code === 202) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
    async deleteBox(id: number) {
      return http
        .request<Box, Response<Box>>("/box/" + id, "DELETE", {})
        .then(async (response) => {
          if (response.code === 204) {
            return response.data;
          }
          return Promise.reject(response);
        });
    },
  },
});
