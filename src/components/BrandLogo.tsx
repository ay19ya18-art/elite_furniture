import { Link } from "react-router-dom";

type Props = { to?: string; className?: string; variant?: "header" | "footer" };

export function BrandLogo({ to = "/", className = "", variant = "header" }: Props) {
  const text =
    variant === "footer" ? (
      <span className="font-display tracking-[0.2em] text-sm uppercase text-white">
        Elite<span className="mx-2 opacity-60">|</span>Furniture
      </span>
    ) : (
      <span className="font-display tracking-[0.18em] text-[0.95rem] sm:text-base uppercase text-ink">
        Elite<span className="mx-2 opacity-50">|</span>Furniture
      </span>
    );

  return (
    <Link to={to} className={`inline-flex items-center ${className}`} aria-label="Elite Furniture home">
      {text}
    </Link>
  );
}
