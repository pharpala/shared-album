import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { createAlbum } from "@/lib/api";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { shareToken } = await createAlbum();
      const link = `${window.location.origin}/album/${shareToken}`;
      setShareLink(link);
      toast.success("Album created!");
    } catch {
      toast.error("Failed to create album. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToAlbum = () => {
    if (!shareLink) return;
    const token = shareLink.split("/album/")[1];
    navigate(`/album/${token}`);
  };

  return (
    <div className="min-h-screen hero-section relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo / brand */}
        <div className="flex items-center gap-3 mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground/80 font-display text-lg tracking-wide">Lumière</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-center leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Share Your
          <br />
          <span className="text-gradient">Moments</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl text-center max-w-lg mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          Create a beautiful shared album in seconds. No sign-up required — just create, share, and collect memories.
        </p>

        {/* Action area */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {!shareLink ? (
            <button
              onClick={handleCreate}
              disabled={creating}
              className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl text-lg transition-all duration-300 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] hover:scale-105 active:scale-95 disabled:opacity-60 disabled:pointer-events-none flex items-center gap-3"
            >
              {creating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Album
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          ) : (
            <div className="glass-card p-8 max-w-md w-full animate-fade-in-scale">
              <p className="text-sm text-muted-foreground mb-3 text-center">Your album is ready! Share this link:</p>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-muted/50 rounded-xl px-4 py-3 text-sm text-foreground/80 truncate font-mono">
                  {shareLink}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors flex items-center gap-2 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleGoToAlbum}
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)] flex items-center justify-center gap-2"
              >
                Open Album
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="absolute bottom-8 text-muted-foreground/40 text-xs tracking-widest uppercase opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
          No account needed • Free forever
        </p>
      </div>
    </div>
  );
};

export default Index;
