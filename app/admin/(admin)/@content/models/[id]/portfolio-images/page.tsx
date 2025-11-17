"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { useModel } from "@/hooks/queries/models/use-model";
import { useUploadPortfolioImage } from "@/hooks/queries/models/use-upload-portfolio-image";
import { useDeletePortfolioImage } from "@/hooks/queries/models/use-delete-portfolio-image";
import { useReorderPortfolioImages } from "@/hooks/queries/models/use-reorder-portfolio-images";
import { PortfolioImagesSkeleton } from "./_components/portfolio-images-skeleton";
import { PortfolioImageItem } from "./_components/portfolio-image-item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMAGE_TYPES } from "@/lib/data/image-types";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import type { InferResponseType } from "hono/client";
import { apiClient } from "@/lib/api/client";

interface PortfolioImagesPageProps {
  params: Promise<{ id: string }>;
}

type ModelImage = InferResponseType<typeof apiClient.api.models[":id"]["$get"], 200>["images"][number];

interface PortfolioImagesFormProps {
  modelId: string;
  initialImages: ModelImage[];
}

function PortfolioImagesForm({ modelId, initialImages }: PortfolioImagesFormProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [selectedType, setSelectedType] = useState<string>("book");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const uploadImage = useUploadPortfolioImage();
  const deleteImage = useDeletePortfolioImage();
  const reorderImages = useReorderPortfolioImages();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadImage.mutate(
      {
        modelId,
        file: selectedFile,
        type: selectedType,
        order: images.length,
      },
      {
        onSuccess: (result) => {
          toast.success("Image uploaded successfully");
          // Optimistically add image
          setImages([...images, result]);
          // Reset form
          setSelectedFile(null);
          // Reset file input
          const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!imageToDelete) return;

    deleteImage.mutate(
      { id: imageToDelete.id, modelId },
      {
        onSuccess: () => {
          toast.success("Image deleted successfully");
          setImages(images.filter((img) => img.id !== imageToDelete.id));
          setDeleteDialogOpen(false);
          setImageToDelete(null);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null) return;

    // Update order in database
    const imageOrders = images.map((img, index) => ({
      id: img.id,
      order: index,
    }));

    reorderImages.mutate(
      {
        modelId,
        images: imageOrders,
      },
      {
        onSuccess: () => {
          toast.success("Images reordered successfully");
        },
        onError: (error) => {
          toast.error(error.message);
          // Revert on error by refetching
          router.refresh();
        },
      }
    );

    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Portfolio Images</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage portfolio images. Drag to reorder.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
          <CardDescription>
            Add images to the model's portfolio. Accepted formats: JPEG, PNG, WebP (max 10MB).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageType">Image Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                  disabled={uploadImage.isPending}
                >
                  <SelectTrigger id="imageType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUpload">Select Image</Label>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={uploadImage.isPending}
                  className="cursor-pointer file:cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploadImage.isPending}
                className="w-full md:w-auto"
              >
                {uploadImage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploadImage.isPending ? "Uploading..." : "Upload Image"}
              </Button>
              {selectedFile && !uploadImage.isPending && (
                <span className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid Section */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Images ({images.length})</CardTitle>
          <CardDescription>
            Drag and drop images to reorder them. Click the trash icon to delete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No images yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload your first portfolio image above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <PortfolioImageItem
                  key={image.id}
                  image={image}
                  index={index}
                  isDragging={draggedIndex === index}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDelete={() => {
                    setImageToDelete({ id: image.id });
                    setDeleteDialogOpen(true);
                  }}
                  isDeleting={deleteImage.isPending && imageToDelete?.id === image.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
      />
    </div>
  );
}

export default function PortfolioImagesPage({ params }: PortfolioImagesPageProps) {
  const { id } = use(params);
  const { data: model, isPending, error } = useModel(id);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (isPending || !model) {
    return <PortfolioImagesSkeleton />;
  }

  return <PortfolioImagesForm modelId={model.id} initialImages={model.images} />;
}
