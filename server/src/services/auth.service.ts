import mongoose from "mongoose";

import { ProviderEnum } from "@/enums/account-provider.enum";
import { Roles } from "@/enums/role.enum";
import { logger } from "@/middlewares/pino-logger";
import AccountModel from "@/models/account.model";
import MemberModel from "@/models/member.model";
import RoleModel from "@/models/roles-permission.model";
import UserModel from "@/models/user.model";
import WorkspaceModel from "@/models/workspace.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@/utils/appError";

export async function loginOrCreateAccountService(data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) {
  const { providerId, provider, displayName, email, picture } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("Started Session...");

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      // Create a new user if it doesn't exist
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider,
        providerId,
      });
      await account.save({ session });

      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return { user };
  }
  catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  finally {
    session.endSession();
  }
}

export async function registerUserService(body: { email: string; name: string; password: string }) {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    logger.warn("End Session...");

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  }
  catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
}

export async function verifyUserService({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) {
  const account = await AccountModel.findOne({ provider, providerId: email });

  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user.omitPassword();
}
