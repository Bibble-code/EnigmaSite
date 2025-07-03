import { createRouter, createWebHistory } from "vue-router";
import EnigmaRequestView from "@/views/EnigmaRequestView.vue";
import CyclometerView from "@/views/CyclometerView.vue";
import InstructionsView from "../views/InstructionsView.vue";
import EnigmaInstructionsView from "../views/EnigmaInstructionsView.vue";
import CyclometerInstructionsView from "../views/CyclometerInstructionsView.vue";

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
    path: "/about",
    name: "about",
    component: InstructionsView,
  },
  {
    path: "/enigma-instructions",
    name: "enigma-instructions",
    component: EnigmaInstructionsView,
  },
  {
    path: "/cyclometer-instructions",
    name: "cyclometer-instructions",
    component: CyclometerInstructionsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
