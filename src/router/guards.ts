import { NavigationGuard, RouteLocationNormalized } from "vue-router";
import http from "@/store/http";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });

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
  console.log(http.checkAuthorization());
};

export default {
  before: [loginGuard],
  after: [],
};
