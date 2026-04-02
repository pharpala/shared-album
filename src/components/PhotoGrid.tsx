import { useState } from "react";
import { Download, X, Expand } from "lucide-react";

interface PhotoGridProps {
  urls: string[];
  loading: boolean;
}

const PhotoGrid = ({ urls, loading }: PhotoGridProps) => {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const handleDownload = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `photo-${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden animate-shimmer"
            style={{ height: `${200 + (i % 3) * 80}px` }}
          />
        ))}
      </div>
    );
  }

  if (!urls.length) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No photos yet.</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Upload some memories to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {urls.map((url, i) => (
          <div
            key={url}
            className="photo-card break-inside-avoid opacity-0 animate-fade-in-scale"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
            onClick={() => setLightboxUrl(url)}
          >
            <img src={url} alt={`Photo ${i + 1}`} loading="lazy" />
            <div className="photo-overlay">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxUrl(url);
                  }}
                  className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center hover:bg-foreground/20 transition-colors"
                >
                  <Expand className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={(e) => handleDownload(url, e)}
                  className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center hover:bg-foreground/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          style={{ animationDuration: "0.2s" }}
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-card/60 backdrop-blur-md flex items-center justify-center hover:bg-card transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <button
            className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-card/60 backdrop-blur-md flex items-center justify-center hover:bg-card transition-colors"
            onClick={(e) => handleDownload(lightboxUrl, e)}
          >
            <Download className="w-5 h-5 text-foreground" />
          </button>
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default PhotoGrid;
