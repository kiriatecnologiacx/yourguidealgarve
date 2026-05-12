import Image from "next/image";
import { Compass } from "lucide-react";

export function TourImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className ?? "object-cover"}
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900">
      <div className="grid place-items-center w-12 h-12 rounded-full bg-brand-yellow/90 text-navy-900">
        <Compass className="w-5 h-5" />
      </div>
    </div>
  );
}
