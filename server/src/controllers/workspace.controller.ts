import type { Request, Response } from "express";

import { HTTPSTATUS } from "@/config/http.config";
import { Permissions } from "@/enums/role.enum";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { getMemberRoleInWorkspace } from "@/services/member.service";
import { changeMemberRoleService, createWorkspaceService, getAllWorkspacesUserIsMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService } from "@/services/workspace.service";
import { roleGuard } from "@/utils/roleGuard";
import { changeRoleSchema, createWorkspaceSchema, workspaceIdSchema } from "@/validation/workspace.validation";

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
  const body = createWorkspaceSchema.parse(req.body);

  const userId = req.user?._id;

  const { workspace } = await createWorkspaceService(userId, body);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Workspace created successfully",
    workspace,
  });
});

export const getAllWorkspacesUserIsMemberController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

  return res.status(HTTPSTATUS.OK).json({
    message: "User workspaces fetched successfully",
    workspaces,
  });
});

export const getWorkspaceMembersController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { members, roles } = await getWorkspaceMembersService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace members retrieved successfully",
    members,
    roles,
  });
});

export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    await getMemberRoleInWorkspace(userId, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace fetched successfully",
      workspace,
    });
  },
);

export const getWorkspaceAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace analytics retrieved successfully",
    analytics,
  });
});

export const changeWorkspaceMemberRoleController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const { memberId, roleId } = changeRoleSchema.parse(req.body);

  const userId = req.user?._id;

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

  const { member } = await changeMemberRoleService(
    workspaceId,
    memberId,
    roleId,
  );

  return res.status(HTTPSTATUS.OK).json({
    message: "Member Role changed successfully",
    member,
  });
});


