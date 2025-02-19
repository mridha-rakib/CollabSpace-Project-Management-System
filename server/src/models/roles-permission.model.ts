import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

import { Permissions, type PermissionType, Roles, type RoleType } from "@/enums/role.enum";
import { RolePermissions } from "@/utils/role-permission";

export interface RoleDocument extends Document {
  name: RoleType;
  permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default(this: RoleDocument) {
        return RolePermissions[this.name];
      },
    },
  },
  {
    timestamps: true,
  },
);

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export default RoleModel;
