import { Model, ModelImage } from "@/db/schema";

export type ModelWithImages = Model & {
  images: ModelImage[];
};
