import Vue from "vue";
import VueRouter from "vue-router";
import GuestRouter from "./guest-router";
import NotFound from "../components/404.vue";
import Offline from "../components/offline.vue";
import managerRouter from "./manager-router";
import employeeRouter from "./employee-router";

Vue.use(VueRouter);

const routes = [];

routes.push(...GuestRouter);
routes.push(...managerRouter);
routes.push(...employeeRouter);
routes.push({
  path: "/offline",
  name: "offline",
  component: Offline
});
routes.push({
  path: "*",
  name: "not-found",
  component: NotFound
});

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
