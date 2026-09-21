import { useState } from "react";
import { Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function extractPlaylistId(url: string): string | null {
  try {
    const u = new URL(url);
    return u.searchParams.get("list");
  } catch {
    return null;
  }
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

interface YouTubePlayerProps {
  url: string;
  title: string;
  description?: string;
  trigger?: React.ReactNode;
}

export function YouTubePlayer({ url, title, description, trigger }: YouTubePlayerProps) {
  const [open, setOpen] = useState(false);

  const playlistId = extractPlaylistId(url);
  const videoId = extractVideoId(url);

  const embedSrc = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`
    : videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : null;

  if (!embedSrc) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="contents">
          {trigger}
        </div>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Video className="size-4" />
          Ko'rish
        </Button>
      )}
      <DialogContent className="max-w-3xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="flex items-center justify-between border-t px-6 py-3">
          <span className="text-xs text-muted-foreground">
            {playlistId ? "YouTube playlist" : "YouTube video"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="mr-1.5 size-3.5" />
            YouTube'da ochish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
