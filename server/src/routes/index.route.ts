import { Router } from "express";

import authRoutes from "./auth.route";
import memberRoutes from "./member.route";
import projectRoutes from "./project.route";
import taskRoutes from "./task.route";
import userRoutes from "./user.routes";
import workspaceRoutes from "./workspace.route";

const rootRoutes = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/user", route: userRoutes },
  { path: "/workspace", route: workspaceRoutes },
  { path: "/member", route: memberRoutes },
  { path: "/project", route: projectRoutes },
  { path: "/task", route: taskRoutes },
];

moduleRoutes.forEach(({ path, route }) => rootRoutes.use(path, route));

export default rootRoutes;
