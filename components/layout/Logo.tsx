import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  /** "light" = for white/light backgrounds, "dark" = for navy sections */
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

// Logo files come from brand/logo-kit/svg (never retype the wordmark). viewBox is 494 × 108.
const RATIO = 494 / 108;

export function Logo({ variant = "light", className = "h-8 lg:h-[38px]", priority = false }: LogoProps) {
  const src = variant === "light" ? "/logo/homeasy-logo-light.svg" : "/logo/homeasy-logo-dark.svg";
  return (
    <Link href="/" aria-label="Homeasy home" className="inline-flex shrink-0 items-center">
      <Image
        src={src}
        alt="Homeasy"
        width={Math.round(38 * RATIO)}
        height={38}
        priority={priority}
        className={`${className} w-auto`}
      />
    </Link>
  );
}
