import { Hono } from "hono";
import { modelRoutes } from "./models/routes";
import { formSubmissionRoutes } from "./form-submissions/routes";

export const api = new Hono()
  .basePath("/api")
  .route("/models", modelRoutes)
  .route("/form-submissions", formSubmissionRoutes);

export type Api = typeof api;
