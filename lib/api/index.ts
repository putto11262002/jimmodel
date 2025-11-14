import { Hono } from "hono";
import { modelRoutes } from "./models/routes";

export const api = new Hono().basePath("/api").route("/models", modelRoutes);

export type Api = typeof api;
