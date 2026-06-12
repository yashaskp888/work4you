import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/work4you-logo.png";
const ICON_SRC = "/work4you-icon.png";
const LOGO_WIDTH = 1536;
const LOGO_HEIGHT = 1024;

type LogoVariant = "navbar" | "footer" | "full";

interface LogoProps {
  /** @deprecated use variant instead */
  size?: "sm" | "md" | "lg" | "xl";
  variant?: LogoVariant;
  href?: string;
  className?: string;
  priority?: boolean;
}

function resolveVariant(size?: LogoProps["size"], variant?: LogoVariant): LogoVariant {
  if (variant) return variant;
  if (size === "lg" || size === "xl") return "full";
  if (size === "md") return "footer";
  return "navbar";
}

export function Logo({
  size,
  variant,
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const resolved = resolveVariant(size, variant);
  const isNavbar = resolved === "navbar";

  return (
    <Link
      href={href}
      className="inline-flex items-center group shrink-0"
      aria-label="Work4You Home"
    >
      {isNavbar ? (
        <span
          className={cn(
            "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center shrink-0",
            className
          )}
        >
          <Image
            src={ICON_SRC}
            alt="Work4You"
            fill
            className="object-contain object-center transition-transform group-hover:scale-[1.05]"
            priority={priority}
            sizes="(max-width: 640px) 56px, 64px"
            unoptimized
          />
        </span>
      ) : (
        <span
          className={cn(
            "block shrink-0 rounded-xl bg-background p-2 sm:p-3",
            resolved === "footer"
              ? "w-[200px] sm:w-[260px] md:w-[300px]"
              : "w-[240px] sm:w-[300px] md:w-[340px]",
            className
          )}
        >
          <Image
            src={LOGO_SRC}
            alt="Work4You — Connect, Grow, Succeed"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className="w-full h-auto aspect-[3/2] object-contain transition-transform group-hover:scale-[1.02]"
            priority={priority}
            sizes={
              resolved === "footer"
                ? "(max-width: 640px) 200px, 300px"
                : "(max-width: 640px) 240px, 340px"
            }
          />
        </span>
      )}
    </Link>
  );
}
