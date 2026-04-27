import logoSrc from "@/assets/logo-kisii-jewish.png";
import { cn } from "@/lib/utils";

export const Logo = ({
  variant = "navbar",
  className,
}: {
  variant?: "navbar" | "footer";
  className?: string;
}) => {
  const sizes =
    variant === "footer"
      ? "h-16 md:h-20 w-auto"
      : "h-10 md:h-12 w-auto";
  return (
    <img
      src={logoSrc}
      alt="Kisii Jewish Community"
      className={cn(sizes, "object-contain select-none", className)}
      draggable={false}
    />
  );
};
