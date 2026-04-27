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
      ? "h-24 md:h-28 w-auto"
      : "h-16 md:h-20 lg:h-24 w-auto";
  return (
    <img
      src={logoSrc}
      alt="Kisii Jewish Community"
      className={cn(sizes, "object-contain select-none", className)}
      draggable={false}
    />
  );
};
