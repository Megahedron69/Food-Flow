import type { PropsWithChildren, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@foodflow/lib";

type AuthShellProps = PropsWithChildren<{
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}>;

export function AuthShell({ title, description, footer, className, children }: AuthShellProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-muted/30 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-brand-glow opacity-70" />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("w-full max-w-md rounded-xl border bg-card p-6 shadow-sm sm:p-8", className)}
      >
        <header className="mb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </header>
        {children}
        {footer ? <footer className="mt-6 text-sm text-muted-foreground">{footer}</footer> : null}
      </motion.section>
    </main>
  );
}
