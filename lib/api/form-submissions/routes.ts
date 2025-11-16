/**
 * Form Submissions API Routes
 *
 * REST API endpoints for managing contact form submissions using Hono.
 * Provides admin functionality for viewing, filtering, and managing submissions.
 */

import * as formSubmissionService from "@/lib/core/form-submissions/service";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  bulkDeleteFormSubmissionsSchema,
  listFormSubmissionsQuerySchema,
  updateFormSubmissionStatusSchema,
} from "./validators";

export const formSubmissionRoutes = new Hono()
  /**
   * GET /api/form-submissions/subjects
   * Get all unique subjects from form submissions
   */
  .get("/subjects", async (c) => {
    try {
      // TODO: Check authentication - admin only
      // const session = await getServerSession(authOptions);
      // if (!session?.user?.isAdmin) {
      //   return c.json({ error: 'Unauthorized' }, 401);
      // }

      const subjects = await formSubmissionService.getUniqueSubjects();
      return c.json({ subjects }, 200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch unique subjects";
      return c.json({ error: message }, 500);
    }
  })
  /**
   * GET /api/form-submissions
   * List all form submissions with pagination, filtering, and search
   */
  .get("/", zValidator("query", listFormSubmissionsQuerySchema), async (c) => {
    try {
      // TODO: Check authentication - admin only
      // const session = await getServerSession(authOptions);
      // if (!session?.user?.isAdmin) {
      //   return c.json({ error: 'Unauthorized' }, 401);
      // }

      const query = c.req.valid("query");
      const result = await formSubmissionService.listFormSubmissions(query);
      return c.json(result, 200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to list form submissions";
      return c.json({ error: message }, 500);
    }
  })
  /**
   * GET /api/form-submissions/:id
   * Get a single form submission by ID
   */
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      try {
        // TODO: Check authentication - admin only
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.isAdmin) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const result = await formSubmissionService.getFormSubmission({ id });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to get form submission";
        if (message === "Form submission not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * PATCH /api/form-submissions/:id
   * Update form submission status (mark as read/responded)
   */
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("json", updateFormSubmissionStatusSchema),
    async (c) => {
      try {
        // TODO: Check authentication - admin only
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.isAdmin) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const { status } = c.req.valid("json");
        const result = await formSubmissionService.updateFormSubmissionStatus({
          id,
          status,
        });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update form submission";
        if (message === "Form submission not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * DELETE /api/form-submissions/:id
   * Delete a single form submission
   */
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      try {
        // TODO: Check authentication - admin only
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.isAdmin) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { id } = c.req.valid("param");
        const result = await formSubmissionService.deleteFormSubmission({ id });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to delete form submission";
        if (message === "Form submission not found") {
          return c.json({ error: message }, 404);
        }
        return c.json({ error: message }, 500);
      }
    },
  )
  /**
   * POST /api/form-submissions/bulk-delete
   * Bulk delete form submissions
   * Note: Using POST instead of DELETE because DELETE requests with JSON bodies
   * can be problematic with some HTTP clients and proxies
   */
  .post(
    "/bulk-delete",
    zValidator("json", bulkDeleteFormSubmissionsSchema),
    async (c) => {
      try {
        // TODO: Check authentication - admin only
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.isAdmin) {
        //   return c.json({ error: 'Unauthorized' }, 401);
        // }

        const { ids } = c.req.valid("json");
        const result = await formSubmissionService.bulkDeleteFormSubmissions({
          ids,
        });
        return c.json(result, 200);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to bulk delete form submissions";
        console.error("Bulk delete error:", err);
        return c.json({ error: message }, 500);
      }
    },
  );
