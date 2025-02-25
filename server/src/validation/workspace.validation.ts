import { z } from "zod";

export const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(1)
  .max(255);

export const descriptionSchema = z.string().trim().optional();

export const workspaceIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Workspace ID is required" });

export const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});
