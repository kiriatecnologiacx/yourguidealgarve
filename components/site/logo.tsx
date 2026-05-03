import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Logo({ variant = "light", className }: LogoProps) {
  const isLight = variant === "light";
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 shrink-0", className)}
      aria-label="YouGuideAlgarve"
    >
      <span
        className={cn(
          "grid place-items-center w-9 h-9 rounded-full",
          isLight ? "bg-brand-yellow" : "bg-navy-800",
        )}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3l9 5-9 5-9-5 9-5z"
            fill={isLight ? "#0a2540" : "#ffcc00"}
          />
          <path
            d="M3 11l9 5 9-5v5l-9 5-9-5v-5z"
            fill={isLight ? "#0a2540" : "#ffcc00"}
            opacity="0.55"
          />
        </svg>
      </span>
      <span className="leading-[1.05] flex flex-col">
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
            isLight ? "text-brand-yellow" : "text-navy-700",
          )}
        >
          algarve
        </span>
      </span>
    </Link>
  );
}
