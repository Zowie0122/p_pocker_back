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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Master,
    children: [{ path: "session/:id", component: Master }],
  },
  {
    path: "/player/:name",
    name: "Player",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
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
