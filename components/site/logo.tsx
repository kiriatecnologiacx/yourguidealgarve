import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showText?: boolean;
};

export function Logo({ variant = "light", className, showText = true }: LogoProps) {
  const isLight = variant === "light";
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 shrink-0", className)}
      aria-label="Your Guide Algarve"
    >
      <Image
        src="/logo.png"
        alt=""
        width={44}
        height={44}
        priority
        className="w-10 h-10 md:w-11 md:h-11"
      />
      {showText ? (
        <span className="leading-[1.05] flex flex-col font-display">
          <span
            className={cn(
              "text-[15px] font-extrabold tracking-tight lowercase",
              isLight ? "text-white" : "text-navy-800",
            )}
          >
            your guide
          </span>
          <span
            className={cn(
              "text-[15px] font-extrabold tracking-tight lowercase -mt-0.5",
              isLight ? "text-brand-orange" : "text-brand-orange-hover",
            )}
          >
            algarve
          </span>
        </span>
      ) : null}
    </Link>
  );
}
