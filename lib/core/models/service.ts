/**
 * Core model service
 * Platform-independent business logic for model operations
 * Handles database operations and business rules
 */

import { db } from "@/db";
import { modelImages, models } from "@/db/schema";
import { createPaginatedResult } from "@/lib/types/common";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  like,
  or,
} from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  GALLERY_PRESET,
  PORTRAIT_PRESET,
  standardizeImage,
} from "../images/transform";
import { deleteFromBlob, uploadToBlob } from "../storage";
import type {
  BulkUpdatePublishedInput,
  CreateModelInput,
  DeleteModelImageInput,
  DeleteModelInput,
  GetModelInput,
  ListModelsInput,
  ReorderModelImagesInput,
  UpdateModelInput,
  UploadModelImageInput,
  UploadProfileImageInput,
} from "./types";
import { computeCategory } from "./utils";

/**
 * Create a new model
 * Automatically computes category from dateOfBirth and gender
 */
export async function createModel(input: CreateModelInput) {
  const category = computeCategory(input.dateOfBirth, input.gender);

  const [newModel] = await db
    .insert(models)
    .values({
      ...input,
      category,
    })
    .returning();

  return newModel;
}

/**
 * Update an existing model
 * Recomputes category if dateOfBirth or gender changes
 */
export async function updateModel(input: UpdateModelInput) {
  // Fetch current model to get existing gender/dateOfBirth
  const [existingModel] = await db
    .select({
      id: models.id,
      gender: models.gender,
      dateOfBirth: models.dateOfBirth,
    })
    .from(models)
    .where(eq(models.id, input.id))
    .limit(1);

  if (!existingModel) {
    throw new Error("Model not found");
  }

  // Determine final gender and dateOfBirth (use new values or fall back to existing)
  const finalGender = input.gender || existingModel.gender;
  const finalDateOfBirth =
    input.dateOfBirth !== undefined
      ? input.dateOfBirth
      : existingModel.dateOfBirth;

  // Recompute category
  const category = computeCategory(finalDateOfBirth, finalGender);

  // Update model
  const [updatedModel] = await db
    .update(models)
    .set({ ...input, category })
    .where(eq(models.id, input.id))
    .returning();

  return updatedModel;
}

/**
 * Get a single model by ID with all portfolio images
 */
export async function getModel(input: GetModelInput) {
  const model = await db.query.models.findFirst({
    where: eq(models.id, input.id),
    with: {
      images: true,
    },
  });

  if (!model) {
    throw new Error("Model not found");
  }

  return model;
}

/**
 * List models with pagination, filtering, and sorting
 */
export async function listModels(input: ListModelsInput) {
  const {
    search,
    page,
    limit,
    sortBy,
    sortOrder,
    category,
    local,
    inTown,
    published,
  } = input;

  // Build WHERE conditions
  const conditions = [];

  if (category) {
    conditions.push(eq(models.category, category));
  }

  if (local !== undefined) {
    conditions.push(eq(models.local, local));
  }

  if (inTown !== undefined) {
    conditions.push(eq(models.inTown, inTown));
  }

  if (published !== undefined) {
    conditions.push(eq(models.published, published));
  }

  if (search !== undefined && search !== "") {
    conditions.push(
      or(
        like(models.name, "%" + search + "%"),
        like(models.nickName, "%" + search + "%"),
        like(models.bio, "%" + search + "%"),
        like(models.ethnicity, "%" + search + "%"),
        like(models.nationality, "%" + search + "%"),
        like(models.hairColor, "%" + search + "%"),
        like(models.eyeColor, "%" + search + "%"),
        like(models.talents, "%" + search + "%"),
        like(models.experiences, "%" + search + "%"),
      ),
    );
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  // Determine sort column and order
  const sortColumn = sortBy
    ? getTableColumns(models)[sortBy]
    : models.createdAt;

  const orderFn = sortOrder === "asc" ? asc : desc;

  // Execute query with conditions
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalCount] = await Promise.all([
    // Fetch paginated data
    db.query.models.findMany({
      where: whereClause,
      orderBy: orderFn(sortColumn as AnyPgColumn),
      with: {
        images: true,
      },
      limit,
      offset,
    }),
    // Count total matching records
    db
      .select({ count: count(models.id) })
      .from(models)
      .where(whereClause)
      .then((result) => result[0]?.count || 0),
  ]);

  return createPaginatedResult(data, totalCount, page, limit);
}

/**
 * Delete a model and all associated images
 * Also cleans up blob storage for all images (best effort)
 */
export async function deleteModel(input: DeleteModelInput) {
  // Fetch model and all images to clean up blob storage
  const [model] = await db
    .select()
    .from(models)
    .where(eq(models.id, input.id))
    .limit(1);

  if (!model) {
    throw new Error("Model not found");
  }

  // Fetch all portfolio images
  const modelImages_list = await db
    .select()
    .from(modelImages)
    .where(eq(modelImages.modelId, input.id));

  // Delete from database (cascade will delete modelImages records)
  await db.delete(models).where(eq(models.id, input.id));

  // Clean up blob storage (best effort - don't fail if blob deletion fails)
  const deletePromises: Promise<void>[] = [];

  // Delete profile image if exists
  if (model.profileImageURL) {
    deletePromises.push(deleteFromBlob(model.profileImageURL));
  }

  // Delete all portfolio images
  for (const image of modelImages_list) {
    deletePromises.push(deleteFromBlob(image.url));
  }

  // Execute all deletions in parallel (fire and forget)
  await Promise.allSettled(deletePromises).catch((err) => {
    console.error("Failed to delete some blob images:", err);
  });

  return { success: true, id: input.id };
}

/**
 * Bulk update published status for multiple models
 */
export async function bulkUpdatePublished(input: BulkUpdatePublishedInput) {
  const { ids, published } = input;

  // Update all models in a single query
  const updatedModels = await db
    .update(models)
    .set({ published })
    .where(inArray(models.id, ids))
    .returning({ id: models.id });

  return {
    success: true,
    updatedCount: updatedModels.length,
    ids: updatedModels.map((m) => m.id),
  };
}

/**
 * Upload and set profile image for a model
 * Processes image, uploads to blob storage, and updates model
 * Old image is deleted from blob storage (best effort)
 */
export async function uploadProfileImage(input: UploadProfileImageInput) {
  // Verify model exists
  const [model] = await db
    .select()
    .from(models)
    .where(eq(models.id, input.modelId))
    .limit(1);

  if (!model) {
    throw new Error("Model not found");
  }

  // Convert File to Buffer
  const buffer = Buffer.from(await input.file.arrayBuffer());

  // Transform image using portrait preset
  const processed = await standardizeImage(buffer, PORTRAIT_PRESET);

  // Upload to blob storage (UUID auto-generated)
  const imageUrl = await uploadToBlob(
    processed,
    "image/jpeg",
    undefined,
    "models/profile",
  );

  // Delete old profile image from blob storage if exists
  if (model.profileImageURL) {
    deleteFromBlob(model.profileImageURL).catch((err) => {
      console.error("Failed to delete old profile image:", err);
    });
  }

  // Update model with new profile image URL
  const [updatedModel] = await db
    .update(models)
    .set({ profileImageURL: imageUrl })
    .where(eq(models.id, input.modelId))
    .returning();

  return {
    model: updatedModel,
    imageUrl,
  };
}

/**
 * Add a portfolio image to a model
 * Processes image, uploads to blob storage, and creates modelImages record
 */
export async function addPortfolioImage(input: UploadModelImageInput) {
  // Verify model exists
  const modelExists = await db
    .select({ id: models.id })
    .from(models)
    .where(eq(models.id, input.modelId))
    .limit(1);

  if (modelExists.length === 0) {
    throw new Error("Model not found");
  }

  // Convert File to Buffer
  const buffer = Buffer.from(await input.file.arrayBuffer());

  // Transform image using gallery preset
  const processed = await standardizeImage(buffer, GALLERY_PRESET);

  // Upload to blob storage (UUID auto-generated)
  const imageUrl = await uploadToBlob(
    processed,
    "image/jpeg",
    undefined,
    "models/portfolio",
  );

  // Create modelImages record
  const [newImage] = await db
    .insert(modelImages)
    .values({
      modelId: input.modelId,
      url: imageUrl,
      type: input.type || null,
      order: input.order || 0,
    })
    .returning();

  return newImage;
}

/**
 * Delete a portfolio image
 * Removes from database and deletes from blob storage (best effort)
 */
export async function deletePortfolioImage(input: DeleteModelImageInput) {
  // Fetch image to get URL for blob deletion
  const [image] = await db
    .select()
    .from(modelImages)
    .where(eq(modelImages.id, input.id))
    .limit(1);

  if (!image) {
    throw new Error("Image not found");
  }

  // Delete from database
  await db.delete(modelImages).where(eq(modelImages.id, input.id));

  // Delete from blob storage (best effort)
  deleteFromBlob(image.url).catch((err) => {
    console.error("Failed to delete image from blob storage:", err);
  });

  return {
    success: true,
    id: input.id,
    url: image.url,
  };
}

/**
 * Reorder portfolio images for a model
 * Updates the order field for multiple images
 */
export async function reorderPortfolioImages(input: ReorderModelImagesInput) {
  // Verify model exists
  const modelExists = await db
    .select({ id: models.id })
    .from(models)
    .where(eq(models.id, input.modelId))
    .limit(1);

  if (modelExists.length === 0) {
    throw new Error("Model not found");
  }

  // Verify all images belong to this model
  const imageIds = input.images.map((img) => img.id);
  const existingImages = await db
    .select()
    .from(modelImages)
    .where(
      and(
        eq(modelImages.modelId, input.modelId),
        inArray(modelImages.id, imageIds),
      ),
    );

  if (existingImages.length !== input.images.length) {
    throw new Error("Some images do not belong to this model or do not exist");
  }

  // Update order for each image
  const updatePromises = input.images.map((img) =>
    db
      .update(modelImages)
      .set({ order: img.order })
      .where(eq(modelImages.id, img.id)),
  );

  await Promise.all(updatePromises);

  return {
    success: true,
    updatedCount: input.images.length,
  };
}
