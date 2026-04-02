import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowRight, Copy, Check } from "lucide-react";
import { createAlbum } from "@/lib/api";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const floatingFrames = [
  { w: 176, h: 224, top: "5%",  left: "1.5%",  right: undefined, bottom: undefined, rotate: -8,  delay: 0,   pos: "10% 20%" },
  { w: 148, h: 196, top: "6%",  left: undefined, right: "2.5%",  bottom: undefined, rotate: 6,   delay: 2,   pos: "90% 5%"  },
  { w: 212, h: 164, top: undefined, left: "2.5%", right: undefined, bottom: "20%", rotate: 4,   delay: 1.2, pos: "20% 85%" },
  { w: 164, h: 212, top: undefined, left: undefined, right: "1.5%", bottom: "14%", rotate: -6,  delay: 0.7, pos: "85% 70%" },
  { w: 116, h: 148, top: "43%", left: "7%",    right: undefined, bottom: undefined, rotate: 9,   delay: 1.6, pos: "5% 50%"  },
  { w: 132, h: 100, top: "35%", left: undefined, right: "5.5%",  bottom: undefined, rotate: -3,  delay: 2.5, pos: "95% 35%" },
];

const features = [
  {
    num: "01",
    title: "One Click",
    desc: "No sign-up, no friction. Create a shared album instantly and start collecting memories.",
  },
  {
    num: "02",
    title: "One Link",
    desc: "Share a single URL. Anyone with the link can upload their shots — no account required.",
  },
  {
    num: "03",
    title: "All Yours",
    desc: "Every photo, full resolution. Download the whole album anytime, forever.",
  },
];

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
    <div className="min-h-screen bg-background film-grain">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-[0.18]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
        </div>

        {/* Floating photo prints */}
        {floatingFrames.map((f, i) => (
          <div
            key={i}
            className="absolute photo-frame animate-float hidden lg:block"
            style={{
              width: f.w,
              height: f.h,
              top: f.top,
              left: f.left,
              right: f.right,
              bottom: f.bottom,
              transform: `rotate(${f.rotate}deg)`,
              animationDelay: `${f.delay}s`,
            }}
          >
            <img
              src={heroBg}
              alt=""
              className="w-full h-full object-cover"
              style={{ objectPosition: f.pos }}
            />
          </div>
        ))}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">

          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-10 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="h-px w-10 bg-primary/50" />
            <span className="text-primary/70 text-xs tracking-[0.35em] uppercase font-medium">
              Photo Sharing · Reimagined
            </span>
            <div className="h-px w-10 bg-primary/50" />
          </div>

          {/* Headline — stacked editorial lines */}
          <h1
            className="font-display font-bold leading-none mb-10 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="block text-[clamp(3.5rem,9vw,7rem)] text-foreground/90 tracking-tight">
              Create.
            </span>
            <span className="block text-[clamp(3.5rem,9vw,7rem)] text-gradient tracking-tight">
              Share.
            </span>
            <span className="block text-[clamp(3.5rem,9vw,7rem)] text-foreground/35 tracking-tight italic">
              Remember.
            </span>
          </h1>

          <p
            className="text-muted-foreground text-base md:text-lg max-w-sm mb-12 leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            One link. Everyone contributes. Every moment, beautifully gathered.
          </p>

          {/* CTA */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {!shareLink ? (
              <button
                onClick={handleCreate}
                disabled={creating}
                className="group relative px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-2xl text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_70px_-8px_hsl(var(--primary)/0.65)] hover:scale-[1.04] active:scale-95 disabled:opacity-60 disabled:pointer-events-none flex items-center gap-3"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Create Your Album
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            ) : (
              <div className="glass-card p-8 max-w-sm w-full animate-fade-in-scale text-left">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs text-muted-foreground tracking-wide uppercase">
                    Album ready — share this link
                  </p>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-muted/50 rounded-xl px-4 py-3 text-xs text-foreground/70 truncate font-mono border border-border/40">
                    {shareLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors flex items-center shrink-0 border border-primary/20"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={handleGoToAlbum}
                  className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.5)] flex items-center justify-center gap-2 text-sm"
                >
                  Open Album
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
          style={{ animationDelay: "1.2s" }}
        >
          <span className="text-muted-foreground/30 text-[10px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-primary/40 to-transparent" />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="relative px-8 py-28 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <div className="h-px w-12 bg-border" />
          <span className="text-muted-foreground/40 text-[10px] tracking-[0.35em] uppercase">
            How it works
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          {features.map((f, i) => (
            <div key={i} className="group">
              <div className="font-display text-[5.5rem] font-bold leading-none text-foreground/[0.04] mb-3 select-none transition-colors duration-700 group-hover:text-primary/[0.08]">
                {f.num}
              </div>
              <div className="w-8 h-px bg-primary/50 mb-6 transition-all duration-500 group-hover:w-16 group-hover:bg-primary" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="relative px-8 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-primary/[0.04] to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent to-border" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground/30 text-[10px] tracking-[0.4em] uppercase mb-8">
            No account needed · Free forever
          </p>
          <h2 className="font-display text-4xl md:text-[3.25rem] font-bold text-foreground leading-tight mb-4">
            Every moment deserves
            <br />
            <span className="text-gradient italic">to be shared.</span>
          </h2>

          {!shareLink && (
            <button
              onClick={handleCreate}
              disabled={creating}
              className="mt-10 group px-8 py-4 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-2xl text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_50px_-8px_hsl(var(--primary)/0.5)] hover:border-transparent flex items-center gap-2 mx-auto"
            >
              Get started — it's free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-t from-transparent to-border" />
      </section>
    </div>
  );
};

export default Index;
