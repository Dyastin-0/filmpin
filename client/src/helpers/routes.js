import { faCompass, faHome } from "@fortawesome/free-solid-svg-icons";

export const routes = [
  { path: "/home", name: "Home", icon: faHome },
  { path: "/discover", name: "Discover", icon: faCompass },
];
export const authRoutes = [
  { path: "/sign-in", name: "Sign In" },
  { path: "/sign-up", name: "Sign Up" },
];
