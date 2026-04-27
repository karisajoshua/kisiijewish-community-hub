import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader = ({ eyebrow, title, description, align = "center", className }: SectionHeaderProps) => (
  <div className={cn("max-w-2xl mb-10", align === "center" ? "mx-auto text-center" : "", className)}>
    {eyebrow && (
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="h-px w-8 bg-accent" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
        <span className="h-px w-8 bg-accent" />
      </div>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">{title}</h2>
    {description && <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>}
  </div>
);
