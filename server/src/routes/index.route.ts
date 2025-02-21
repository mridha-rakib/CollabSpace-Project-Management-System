import { Router } from "express";

import authRoutes from "./auth.route";

const rootRoutes = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
];

moduleRoutes.forEach(({ path, route }) => rootRoutes.use(path, route));

export default rootRoutes;
