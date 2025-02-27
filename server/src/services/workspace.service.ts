import type mongoose from "mongoose";

import { Roles } from "@/enums/role.enum";
import { TaskStatusEnum } from "@/enums/task.enum";
import MemberModel from "@/models/member.model";
import RoleModel from "@/models/roles-permission.model";
import TaskModel from "@/models/task.model";
import UserModel from "@/models/user.model";
import WorkspaceModel from "@/models/workspace.model";
import { NotFoundException } from "@/utils/appError";

export async function createWorkspaceService(userId: string, body: {
  name: string;
  description?: string | undefined;
}) {
  const { name, description } = body;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });

  if (!ownerRole) {
    throw new NotFoundException("Owner role not found");
  }

  const workspace = new WorkspaceModel({
    name,
    description,
    owner: user._id,
  });

  await workspace.save();

  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });

  await member.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

  await user.save();

  return {
    workspace,
  };
}

export async function getAllWorkspacesUserIsMemberService(userId: string) {
  const memberships = await MemberModel.find({ userId })
    .populate("workspaceId")
    .select("-password")
    .exec();

  const workspaces = memberships.map(membership => membership.workspaceId);

  return { workspaces };
}

export async function getWorkspaceMembersService(workspaceId: string) {
  const members = await MemberModel.find({ workspaceId }).populate("userId", "name email profilePicture -password").populate("role", "name");

  const roles = await RoleModel.find({}, { name: 1, _id: 1 }).select("-permission").lean();

  return { members, roles };
}

export async function getWorkspaceByIdService(workspaceId: string) {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const members = await MemberModel.find({
    workspaceId,
  }).populate("role");

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
  };

  return {
    workspace: workspaceWithMembers,
  };
}

export async function getWorkspaceAnalyticsService(workspaceId: string) {
  const currentDate = new Date();

  const totalTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
  });

  const overdueTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    dueDate: { $lt: currentDate },
    status: { $ne: TaskStatusEnum.DONE },
  });

  const completedTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.DONE,
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
}

export async function changeMemberRoleService(workspaceId: string, memberId: string, roleId: string) {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new NotFoundException("Role not found");
  }

  const member = await MemberModel.findOne({
    userId: memberId,
    workspaceId,
  });

  if (!member) {
    throw new Error("Member not found in the workspace");
  }

  member.role = role;
  await member.save();

  return {
    member,
  };
}

export async function updateWorkspaceByIdService(workspaceId: string, name: string, description?: string) {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  workspace.name = name || workspace.name;
  workspace.description = description || workspace.description;
  await workspace.save();

  return {
    workspace,
  };
}
