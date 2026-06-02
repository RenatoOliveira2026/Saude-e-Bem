import { cn } from "@/lib/cn";
import Image from "next/image";

interface ContentCoverProps {
  src?: string;
  alt: string;
  className?: string;
  aspect?: "video" | "card";
  children?: React.ReactNode;
}

export function ContentCover({
  src,
  alt,
  className,
  aspect = "card",
  children,
}: ContentCoverProps) {
  const aspectClass = aspect === "video" ? "aspect-video" : "aspect-[4/3]";
  const hasFixedSize =
    Boolean(className?.includes("h-")) && Boolean(className?.includes("w-"));

  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          !hasFixedSize && aspectClass,
          className,
        )}
      >
        <Image src={src} alt={alt} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-sage-muted via-off-white to-gold-muted/30",
        !hasFixedSize && aspectClass,
        className,
      )}
      aria-hidden={!children}
    >
      {children}
    </div>
  );
}
