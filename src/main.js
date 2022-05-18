import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueMaterial from "vue-material";

import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import "./assets/main.scss";
import "./assets/bootstrap.css";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import VueAxios from "vue-axios";
import i18n from "./i18n";
import {
  Input,
  Form,
  FormItem,
  InfiniteScroll,
  InputNumber,
  Upload,
  Image,
  Select,
  Button,
  Timeline,
  TimelineItem,
  Card,
  OptionGroup,
  Option,
  Loading,
  Notification,
  MessageBox,
  Message,
  DatePicker,
  Link,
  Tag,
  Table,
  TableColumn,
  Pagination
} from "element-ui";
import { bus } from "./plugins/bus";
import "./registerServiceWorker";
import { reloadApiToken } from "./utilty/helpers";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

// configure language
locale.use(lang);

Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Card);
Vue.use(Input);
Vue.use(Form);
Vue.use(Tag);
Vue.use(FormItem);
Vue.use(InputNumber);
Vue.use(Upload);
Vue.use(Button);
Vue.use(Image);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(DatePicker);
Vue.use(Loading.directive);
Vue.use(InfiniteScroll);
Vue.use(Link);
Vue.use(Pagination);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(VueMaterial);

Vue.config.productionTip = false;

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

axios.defaults.baseURL = API_BASE_URL;

window.axios = axios;

reloadApiToken();

Vue.use(VueAxios, axios);
Vue.use(require("vue-moment"));

Vue.mixin({
  methods: {
    moneyFormat: function(x) {
      if (!x) return "0";
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
});

store
  .dispatch("auth/me")
  .then(() => {
    initApp();
  })
  .catch(error => {
    initApp();
  });

function initApp() {
  const app = new Vue({
    router,
    store,
    i18n,
    axios,
    created() {
      var this_this = this;
      axios.interceptors.response.use(function(response) {
        if (response.data.offline) {
          this_this.$router.push({ name: "offline" });
        } else {
          return response;
        }
      }, this.errorResponseHandler);
    },

    methods: {
      errorResponseHandler(error) {
        bus.$emit("destroy-ajax-loader");

        if (error.response.status == 401) {
          if (this.$route.fullPath.includes("/dashboard/")) {
            localStorage.removeItem("currentUser");

            bus.$emit("user-logged-out");

            this.$notify({
              title: "Error!",
              message: error.response.data.message,
              type: "error"
            });

            this.$router.push({ name: "login-register" });
          } else {
            return Promise.reject(error);
          }
        } else if (
          error.response.data.status == 502 &&
          error.response.data.offline
        ) {
          this.$notify({
            title: "Offline",
            message: error.response.data.message,
            type: "warning"
          });

          router.push({ name: "offline" });

          return Promise.reject(error);
        } else {
          this.$notify({
            title: "Error",
            message: error.response.data.message,
            type: "error"
          });

          return Promise.reject(error);
        }
      }
    },
    render: h => h(App)
  }).$mount("#app");
}
