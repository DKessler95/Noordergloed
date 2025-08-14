import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProductImageUploaderProps {
  productId?: number;
  currentImageUrl?: string | null;
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
}

export function ProductImageUploader({ 
  productId, 
  currentImageUrl, 
  onImageUploaded, 
  className = "" 
}: ProductImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentImageUrl || "");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ongeldig bestandstype",
        description: "Upload alleen afbeelding bestanden (jpg, png, gif, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Bestand te groot",
        description: "Afbeelding mag maximaal 10MB zijn",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get upload URL
      const uploadResponse = await apiRequest("POST", "/api/objects/upload", {});
      const { uploadURL } = await uploadResponse.json();

      // Upload file directly to storage
      const fileUpload = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!fileUpload.ok) {
        throw new Error('Upload failed');
      }

      // Set ACL policy for the uploaded image
      const aclResponse = await apiRequest("PUT", "/api/product-images", {
        imageURL: uploadURL,
      });
      const { objectPath } = await aclResponse.json();

      onImageUploaded(objectPath);
      setUrlInput(objectPath);

      toast({
        title: "Afbeelding geüpload",
        description: "De productafbeelding is succesvol geüpload.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload mislukt",
        description: "Er ging iets mis bij het uploaden van de afbeelding.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageUploaded(urlInput.trim());
      toast({
        title: "Afbeelding URL ingesteld",
        description: "De afbeelding URL is succesvol bijgewerkt.",
      });
    }
  };

  const clearImage = () => {
    setUrlInput("");
    onImageUploaded("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="relative">
          <img 
            src={currentImageUrl.startsWith('/objects/') 
              ? currentImageUrl 
              : currentImageUrl
            }
            alt="Product afbeelding"
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NCA2NEw2NCA4NEw0NCA2NEw2NCA0NEw4NCA2NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
            }}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-3">
        {/* File Upload */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Upload nieuwe afbeelding</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? "Uploaden..." : "Selecteer"}
            </Button>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Of voer afbeelding URL in</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              <Image className="h-4 w-4 mr-1" />
              Instellen
            </Button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Upload een afbeelding (max 10MB) of voer een externe URL in. Ondersteunde formaten: JPG, PNG, GIF.
      </p>
    </div>
  );
}