import ProjectModel from "@/models/project.model";
import { NotFoundException } from "@/utils/appError";

export async function createProjectService(userId: string, workspaceId: string, body: {
  emoji?: string;
  name: string;
  description?: string;
}) {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();

  return { project };
}

export async function getProjectsInWorkspaceService(workspaceId: string, pageSize: number, pageNumber: number) {
  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await ProjectModel.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
}

export async function getProjectByIdAndWorkspaceIdService(workspaceId: string, projectId: string) {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace",
    );
  }

  return { project };
}
