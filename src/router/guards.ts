import { NavigationGuard, RouteLocationNormalized } from "vue-router";
import http from "@/store/http";
import { useBoxStore } from "@/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });
import axios from 'axios';

const loginIgnore = {
  names: ["404", "403", "login", "verify", "register"],
  paths: ["/login", "/verify", "/register"],

  includes(route: RouteLocationNormalized) {
    return (
      this.names.includes(route.name as string) ||
      this.paths.includes(route.path)
    );
  },
};

const loginGuard: NavigationGuard = async function (to) {
  if (!http.checkAuthorization() && !loginIgnore.includes(to)) {
    return "/login";
  } else if (http.checkAuthorization() && loginIgnore.includes(to)) {
    return "/";
  }
};

const stopShowCamera: NavigationGuard = async function () {
  const boxStore = useBoxStore();
  await boxStore.boxList.forEach( async (box) => {
    console.log(box.link + 'stop_stream')
    await axios.get(box.link + 'stop_stream');
  });
};

export default {
  before: [loginGuard, stopShowCamera],
  after: [],
};
