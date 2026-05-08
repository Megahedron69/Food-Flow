import type { PropsWithChildren, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@foodflow/lib";

type SectionShellProps = PropsWithChildren<{
  id?: string;
  className?: string;
  heading?: ReactNode;
  subheading?: ReactNode;
}>;

export function SectionShell({ id, className, heading, subheading, children }: SectionShellProps) {
  return (
    <section id={id} className={cn("section-shell", className)}>
      {(heading || subheading) && (
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {heading ? <h2 className="section-heading text-balance">{heading}</h2> : null}
          {subheading ? <p className="section-subheading text-balance">{subheading}</p> : null}
        </motion.header>
      )}
      <div className={cn((heading || subheading) && "mt-10 sm:mt-12")}>{children}</div>
    </section>
  );
}
