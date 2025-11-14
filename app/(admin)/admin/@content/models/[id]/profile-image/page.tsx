"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Upload, Loader2, AlertCircle } from "lucide-react";
import { useModel } from "@/hooks/queries/models/use-model";
import { useUploadProfileImage } from "@/hooks/queries/models/use-upload-profile-image";
import { ModelFormSkeleton } from "../_components/model-form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Model } from "@/db/schema";

interface ProfileImagePageProps {
  params: Promise<{ id: string }>;
}

interface ProfileImageFormProps {
  initialData: Model;
}

function ProfileImageForm({ initialData }: ProfileImageFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadProfileImage = useUploadProfileImage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.profileImageURL,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    uploadProfileImage.mutate(
      { modelId: initialData.id, file: selectedFile },
      {
        onSuccess: () => {
          toast.success("Profile image updated successfully");
          setSelectedFile(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: (error) => {
          toast.error(error.message);
          // Revert preview to original
          setPreviewUrl(initialData.profileImageURL);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      },
    );
  };

  const handleCancel = () => {
    if (selectedFile) {
      // Reset to original image
      setPreviewUrl(initialData.profileImageURL);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      // Navigate back to models list
      router.push("/admin/models");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Image</CardTitle>
        <CardDescription>
          Upload a profile image for this model. This will be displayed as the
          main image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Preview */}
        <div className="flex justify-start">
          {previewUrl ? (
            <div className="relative w-64 h-64 rounded-lg overflow-hidden border">
              <Image
                src={previewUrl}
                alt={initialData.name || "Model"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border border-dashed">
              <User className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="profileImage">
            {selectedFile ? "Change Image" : "Upload New Image"}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="profileImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploadProfileImage.isPending}
              className="cursor-pointer"
            />
            {selectedFile && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadProfileImage.isPending}
                title="Choose different file"
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Accepted formats: JPEG, PNG, WebP (max 10MB). Recommended: Square
            image (1:1 ratio).
          </p>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Selected File</p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={uploadProfileImage.isPending}
        >
          {selectedFile ? "Reset" : "Cancel"}
        </Button>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={uploadProfileImage.isPending || !selectedFile}
        >
          {uploadProfileImage.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {uploadProfileImage.isPending ? "Uploading..." : "Upload Image"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ProfileImagePage({ params }: ProfileImagePageProps) {
  const { id } = use(params);
  const { data: model, isLoading, error } = useModel(id);

  if (isLoading) {
    return <ModelFormSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return <ProfileImageForm initialData={model as any} />;
}
