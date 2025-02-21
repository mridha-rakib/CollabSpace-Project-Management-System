import mongoose from "mongoose";

import { connectDB } from "@/config/database.config";
import { logger } from "@/middlewares/pino-logger";
import RoleModel from "@/models/roles-permission.model";
import { RolePermissions } from "@/utils/role-permission";

async function seedRoles() {
  logger.info("Seeding roles started...");

  try {
    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    logger.info("Clearing existing roles...");
    await RoleModel.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      // Check if the role already exists
      const existingRole = await RoleModel.findOne({ name: role }).session(
        session,
      );
      if (!existingRole) {
        const newRole = new RoleModel({
          name: role,
          permissions,
        });
        await newRole.save({ session });
        logger.info(`Role ${role} added with permissions.`);
      }
      else {
        logger.info(`Role ${role} already exists.`);
      }
    }

    await session.commitTransaction();
    logger.info("Transaction committed.");

    session.endSession();
    logger.info("Session ended.");

    logger.info("Seeding completed successfully.");
    process.exit(0);
  }
  catch (error) {
    logger.error("Error during seeding:", error);
  }
}

seedRoles().catch(error =>
  console.error("Error running seed script:", error),
);
