import Home from "@/components/guest/home-page.vue";
import Login from "@/components/guest/auth/login.vue";
import LoginRegister from "@/components/guest/auth/login-register.vue";
import ForgetPassword from "@/components/guest/auth/forget-password.vue";
import Register from "@/components/guest/auth/register.vue";

export default [
  {
    path: "/",
    name: "home",
    component: LoginRegister,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/guest/about.vue"),
  },

  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(
        /* webpackChunkName: "contact" */ "../components/guest/contact.vue"
      ),
  },
  {
    path: "/login-register",
    name: "login-register",
    component: LoginRegister,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register/:phone",
    name: "register",
    component: Register,
  },
  {
    path: "/forget-password/",
    name: "forget-password",
    component: ForgetPassword,
  },
];
