"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) {
      try { step(generator.next(value)); }
      catch (e) { reject(e); }
    }
    function rejected(value) {
      try { step(generator.throw(value)); }
      catch (e) { reject(e); }
    }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = { label: 0, sent() {
    if (t[0] & 1)
      throw t[1]; return t[1];
  }, trys: [], ops: [] }; let f; let y; let t; let g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g.throw = verb(1), g.return = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2])
              _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      }
      catch (e) { op = [6, e]; y = 0; }
      finally { f = t = 0; }
    }
    if (op[0] & 5)
      throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");

const database_config_1 = require("@/config/database.config");
const env_1 = require("@/env");
const pino_logger_1 = require("@/middlewares/pino-logger");
const roles_permission_model_1 = require("@/models/roles-permission.model");
const role_permission_1 = require("@/utils/role-permission");

function seedRoles() {
  return __awaiter(this, void 0, void 0, function () {
    let session, _a, _b, _c, _i, roleName, role, permissions, existingRole, newRole, error_1;
    return __generator(this, (_d) => {
      switch (_d.label) {
        case 0:
          pino_logger_1.logger.info("Seeding roles started...");
          _d.label = 1;
        case 1:
          _d.trys.push([1, 13, , 14]);
          return [4 /* yield */, (0, database_config_1.connectDB)()];
        case 2:
          _d.sent();
          return [4 /* yield */, mongoose_1.default.startSession()];
        case 3:
          session = _d.sent();
          session.startTransaction();
          pino_logger_1.logger.info("Clearing existing roles...");
          return [4 /* yield */, roles_permission_model_1.default.deleteMany({}, { session })];
        case 4:
          _d.sent();
          _a = role_permission_1.RolePermissions;
          _b = [];
          for (_c in _a)
            _b.push(_c);
          _i = 0;
          _d.label = 5;
        case 5:
          if (!(_i < _b.length))
            return [3 /* break */, 12];
          _c = _b[_i];
          if (!(_c in _a))
            return [3 /* break */, 11];
          roleName = _c;
          role = roleName;
          permissions = role_permission_1.RolePermissions[role];
          return [4 /* yield */, roles_permission_model_1.default.findOne({ name: role }).session(session)];
        case 6:
          existingRole = _d.sent();
          if (existingRole)
            return [3 /* break */, 8];
          newRole = new roles_permission_model_1.default({
            name: role,
            permissions,
          });
          return [4 /* yield */, newRole.save({ session })];
        case 7:
          _d.sent();
          pino_logger_1.logger.info("Role ".concat(String(role), " added with permissions."));
          pino_logger_1.logger.info("Here we are: ", env_1.default.MONGO_URI);
          pino_logger_1.logger.info("Role ".concat(role, " added with permissions."));
          return [3 /* break */, 9];
        case 8:
          pino_logger_1.logger.info("Role ".concat(role, " already exists."));
          _d.label = 9;
        case 9: return [4 /* yield */, session.commitTransaction()];
        case 10:
          _d.sent();
          pino_logger_1.logger.info("Transaction committed.");
          session.endSession();
          pino_logger_1.logger.info("Session ended.");
          pino_logger_1.logger.info("Seeding completed successfully.");
          _d.label = 11;
        case 11:
          _i++;
          return [3 /* break */, 5];
        case 12: return [3 /* break */, 14];
        case 13:
          error_1 = _d.sent();
          pino_logger_1.logger.error("Error during seeding:", error_1);
          return [3 /* break */, 14];
        case 14: return [2];
      }
    });
  });
}
seedRoles().catch((error) => { return pino_logger_1.logger.error("Error running seed script: ", error); });
