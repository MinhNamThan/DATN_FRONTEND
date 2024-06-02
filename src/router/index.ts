import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import guards from "./guards";

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
});
guards.before.forEach(router.beforeEach);

export default router;
