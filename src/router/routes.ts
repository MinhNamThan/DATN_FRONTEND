import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/registerPage/RegisterView.vue"),
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("../views/registerPage/VerifyView.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("../layouts/CommonView.vue"),
    children: [
      {
        path: "/",
        name: "HomePage",
        component: () => import("@/views/homePage/HomeView.vue"),
      },
      {
        path: "/place",
        name: "place",
        component: () => import("@/views/Place/PLaceView.vue"),
      },
      {
        path: "/box",
        name: "box",
        component: () => import("@/views/Box/BoxView.vue"),
      },
      {
        path: "/camera",
        name: "camera",
        component: () => import("@/views/Camera/CameraView.vue"),
      },
      {
        path: '/notification/:id',
        name: 'Notification',
        component: () => import('@/views/Notification/NotificationView.vue'),
      },
    ],
  },
];

export default routes;
