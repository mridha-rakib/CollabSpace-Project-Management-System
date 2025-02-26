import { Router } from "express";

import { createWorkspaceController, getAllWorkspacesUserIsMemberController, getWorkspaceMembersController } from "@/controllers/workspace.controller";
import isAuthenticated from "@/middlewares/isAuthenticated.middleware";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", isAuthenticated, createWorkspaceController);

workspaceRoutes.get("/all", isAuthenticated, getAllWorkspacesUserIsMemberController);
workspaceRoutes.get("/members/:id", isAuthenticated, getWorkspaceMembersController);

export default workspaceRoutes;
