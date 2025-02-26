import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./user.routes";
import workspaceRoutes from "./workspace.route";

const rootRoutes = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/user", route: userRoutes },
  { path: "/workspace", route: workspaceRoutes },
];

moduleRoutes.forEach(({ path, route }) => rootRoutes.use(path, route));

export default rootRoutes;
