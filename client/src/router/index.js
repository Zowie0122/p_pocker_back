import Vue from "vue";
import VueRouter from "vue-router";
import WelcomeScreen from "../views/WelcomeScreen.vue";
import Master from "../views/Master.vue";
import Player from "../views/Player.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "WelcomeScreen",
    component: WelcomeScreen,
  },
  {
    path: "/master",
    name: "Master",
    component: Master,
    children: [{ path: "session/:id", component: Master }],
  },
  {
    path: "/player/:name",
    name: "Player",
    component: Player,
    children: [{ path: "session/:id", component: Player }],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
