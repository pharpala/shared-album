import { useState, useCallback, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
}

const UploadZone = ({ onFilesSelected, uploading }: UploadZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
    e.target.value = "";
  };

  return (
    <div
      className={`upload-zone p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
        dragging ? "dragging" : ""
      } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        {uploading ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <Upload className="w-7 h-7 text-primary" />
        )}
      </div>
      <p className="text-foreground font-medium text-lg font-display">
        {uploading ? "Uploading..." : "Drop photos here"}
      </p>
      <p className="text-muted-foreground text-sm">
        {uploading
          ? "Please wait while your photos are being uploaded"
          : "or click to browse • Images only"}
      </p>
      <div className="flex gap-2 mt-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center"
          >
            <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadZone;
