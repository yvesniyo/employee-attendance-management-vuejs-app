export const reloadApiToken = () => {
  window.axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("member_token");
};
