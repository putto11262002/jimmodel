export const IMAGE_TYPES = ["book", "polaroid", "composite"] as const;

export type ImageType = (typeof IMAGE_TYPES)[number];
