/**
 * Models API Routes
 *
 * REST API endpoints for model management using Hono.
 * Replaces the server actions from actions/models/action.ts
 */

import * as modelService from "@/lib/core/models/service";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  bulkUpdatePublishedSchema,
  createModelSchema,
  listModelsQuerySchema,
  reorderModelImagesSchema,
  updateModelSchema,
  uploadModelImageSchema,
  uploadProfileImageSchema,
} from "./validators";

export const modelRoutes = new Hono()
  .get("/", zValidator("query", listModelsQuerySchema), async (c) => {
    try {
      const query = c.req.valid("query");
      const result = await modelService.listModels(query);
      return c.json(result, 200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to list models";
      return c.json({ error: message }, 500);
    }
  })
  .post("/", zValidator("json", createModelSchema), async (c) => {
    try {
      // TODO: Check authentication
      // const session = await getServerSession(authOptions);
      // if (!session?.user?.id) {
      //   return c.json({ error: 'Unauthorized' }, 401);
      // }

      const data = c.req.valid("json");
      const result = await modelService.createModel(data);
      return c.json(result, 201);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create model";
      return c.json({ error: message }, 500);
    }
  })
  /**
   * GET /api/models/:id
   * Get a single model by ID
   */
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const result = await modelService.getModel({ id });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to get model";
        if (message === "Model not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * PUT /api/models/:id
   * Update an existing model
   */
  .put(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("json", updateModelSchema),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const data = c.req.valid("json");
        const result = await modelService.updateModel({ id, ...data });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update model";
        if (message === "Model not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * DELETE /api/models/:id
   * Delete a model
   */
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const result = await modelService.deleteModel({ id });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete model";
        if (message === "Model not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * PATCH /api/models/bulk-publish
   * Bulk update published status for multiple models
   */
  .patch(
    "/bulk-publish",
    zValidator("json", bulkUpdatePublishedSchema),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const data = c.req.valid("json");
        const result = await modelService.bulkUpdatePublished(data);
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to bulk update models";
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * POST /api/models/:id/profile-image
   * Upload and set profile image for a model
   */
  .post(
    "/:id/profile-image",
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("form", uploadProfileImageSchema),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const data = c.req.valid("form");

        const result = await modelService.uploadProfileImage({
          modelId: id,
          file: data.file,
        });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload profile image";
        if (message === "Model not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * POST /api/models/:id/images
   * Upload a portfolio image for a model
   */
  .post(
    "/:id/images",
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("form", uploadModelImageSchema),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const { file, type, order } = c.req.valid("form");

        const result = await modelService.addPortfolioImage({
          modelId: id,
          file: file,
          type: type,
          order: order,
        });
        return c.json(result, 201);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload image";
        if (message === "Model not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * DELETE /api/models/images/:id
   * Delete a portfolio image
   */
  .delete(
    "/images/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const result = await modelService.deletePortfolioImage({ id });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete image";
        if (message === "Image not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * PATCH /api/models/:id/images/reorder
   * Reorder portfolio images for a model
   */
  .patch(
    "/:id/images/reorder",
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("json", reorderModelImagesSchema.omit({ modelId: true })),
    async (c) => {
      try {
        // TODO: Check authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.id) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const data = c.req.valid("json");
        const result = await modelService.reorderPortfolioImages({
          modelId: id,
          ...data,
        });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to reorder images";
        if (message.includes("do not exist") || message === "Model not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  );
