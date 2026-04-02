import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Camera, ArrowLeft, RefreshCw } from "lucide-react";
import { getUploadUrl, getPhotos, uploadFile } from "@/lib/api";
import { toast } from "sonner";
import UploadZone from "@/components/UploadZone";
import PhotoGrid from "@/components/PhotoGrid";

const AlbumPage = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (!shareToken) return;
    try {
      const urls = await getPhotos(shareToken);
      setPhotos(urls);
    } catch {
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, [shareToken]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (files: File[]) => {
    if (!shareToken) return;
    setUploading(true);
    try {
      for (const file of files) {
        const uploadUrl = await getUploadUrl(shareToken, file.name);
        await uploadFile(uploadUrl, file);
      }
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} uploaded!`);
      await fetchPhotos();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-foreground text-sm tracking-wide">Lumière</span>
            </div>
          </Link>
          <button
            onClick={() => {
              setLoading(true);
              fetchPhotos();
            }}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Refresh photos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Upload section */}
        <section className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <UploadZone onFilesSelected={handleUpload} uploading={uploading} />
        </section>

        {/* Gallery section */}
        <section className="opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold text-foreground">
              Gallery
            </h2>
            {photos.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <PhotoGrid urls={photos} loading={loading} />
        </section>
      </main>
    </div>
  );
};

export default AlbumPage;
