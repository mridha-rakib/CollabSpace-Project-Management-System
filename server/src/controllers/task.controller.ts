import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/asyncHandler.middleware";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const body = createTaskSchema.parse(req.body);
  },
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const getAllTasksController = asyncHandler(async (req: Request, res: Response) => {});

export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {},
);
