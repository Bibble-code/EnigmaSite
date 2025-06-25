import { createRouter, createWebHistory } from "vue-router";
import EnigmaRequestView from "@/views/EnigmaRequestView.vue";
import CyclometerView from "@/views/CyclometerView.vue";
import InstructionsView from "../views/InstructionsView.vue";

const routes = [
  {
    path: "/",
    name: "enigma",
    component: EnigmaRequestView,
  },
  {
    path: "/enigma",
    redirect: "/", // Nur Weiterleitung, kein Component mehr hier!
  },
  {
    path: "/cyclometer",
    name: "cyclometer",
    component: CyclometerView,
  },
  {
    path: "/manual",
    name: "manual",
    component: InstructionsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
