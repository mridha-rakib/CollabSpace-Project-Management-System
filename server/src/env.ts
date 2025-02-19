import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    MONGO_URI: z.string().url(),
  },
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(8000),
    SESSION_SECRET: z.string(),
    BASE_PATH: z.string().default("/api/v1"),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  },
  runtimeEnv: process.env,
});

export default env;
