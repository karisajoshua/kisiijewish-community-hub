import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PageHero = ({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) => (
  <section className={cn("relative gradient-hero text-primary-foreground py-20 md:py-28", className)}>
    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%)]" />
    <div className="container mx-auto px-4 relative">
      <div className="max-w-3xl fade-in-up">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Kisiijewish Community</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{title}</h1>
        {subtitle && <p className="mt-5 text-lg text-primary-foreground/80 leading-relaxed max-w-2xl">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  </section>
);
