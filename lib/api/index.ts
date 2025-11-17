import { Hono } from "hono";
import { authMiddleware } from "./middlewares/auth";
import { modelRoutes } from "./models/routes";
import { formSubmissionRoutes } from "./form-submissions/routes";

export const api = new Hono()
  .basePath("/api")
  .use("*", authMiddleware) // Apply auth middleware to all routes
  .route("/models", modelRoutes)
  .route("/form-submissions", formSubmissionRoutes);

export type Api = typeof api;
