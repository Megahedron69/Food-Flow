import { useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChefHat,
  Menu,
  MonitorSmartphone,
  Moon,
  ShieldCheck,
  ShoppingBasket,
  Sun,
  Users,
  UtensilsCrossed,
  WifiOff,
  X
} from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@foodflow/ui";
import { cn } from "@foodflow/lib";
import { SectionShell } from "@/features/marketing/components/section-shell";
import { defaultLocale, landingCopy } from "@/features/marketing/content/landing-copy";

type FeatureIconKey =
  | "Touchscreen POS Billing"
  | "Offline Billing"
  | "GST-Compliant Receipts"
  | "Multi-Outlet Management"
  | "Inventory Tracking"
  | "Role-Based Staff Access"
  | "Live Kitchen Updates"
  | "Reporting & Analytics";

const featureIconMap: Record<FeatureIconKey, ComponentType<{ className?: string }>> = {
  "Touchscreen POS Billing": MonitorSmartphone,
  "Offline Billing": WifiOff,
  "GST-Compliant Receipts": ShieldCheck,
  "Multi-Outlet Management": UtensilsCrossed,
  "Inventory Tracking": ShoppingBasket,
  "Role-Based Staff Access": Users,
  "Live Kitchen Updates": ChefHat,
  "Reporting & Analytics": BarChart3
};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      className="rounded-full"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

function BrandMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-lg bg-foreground text-background">
        <span className="font-display text-sm font-semibold">FF</span>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">FoodFlow</span>
    </Link>
  );
}

export function LandingPage() {
  const copy = useMemo(() => landingCopy[defaultLocale], []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-brand-glow" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-brand-grid opacity-20" />

      <header className="sticky top-0 z-50 border-b bg-background/92 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <BrandMark />

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">
              {copy.nav.features}
            </a>
            <a href="#pricing" className="transition hover:text-foreground">
              {copy.nav.pricing}
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">{copy.nav.login}</Link>
            </Button>
            <Button asChild>
              <a href="#cta">{copy.nav.primaryCta}</a>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
              }}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t bg-background md:hidden"
            >
              <div className="container flex flex-col gap-2 py-4">
                <a
                  href="#features"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  {copy.nav.features}
                </a>
                <a
                  href="#pricing"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  {copy.nav.pricing}
                </a>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  {copy.nav.login}
                </Link>
                <Button asChild className="mt-2">
                  <a
                    href="#cta"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {copy.nav.primaryCta}
                  </a>
                </Button>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <section className="section-shell pt-14 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="inline-flex rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                {copy.hero.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
                {copy.hero.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <a href="#cta">
                    {copy.hero.primaryCta}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#pricing">{copy.hero.secondaryCta}</a>
                </Button>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {copy.hero.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                    <Check className="size-4 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
              className="surface-card overflow-hidden"
            >
              <div className="border-b bg-muted/50 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">FoodFlow Operations</p>
                    <p className="text-xs text-muted-foreground">Multi-outlet realtime console</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-xs text-success">
                    Live
                    <span className="size-1.5 rounded-full bg-success" />
                  </span>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                {[
                  { label: "Today Orders", value: "1,284", delta: "+14%" },
                  { label: "Average Ticket", value: "INR 412", delta: "+6%" },
                  { label: "KDS SLA", value: "97.2%", delta: "Stable" },
                  { label: "Sync Queue", value: "0 Pending", delta: "Healthy" }
                ].map((stat) => (
                  <Card key={stat.label} className="border-border/80 shadow-none">
                    <CardHeader className="space-y-1 pb-3">
                      <CardDescription>{stat.label}</CardDescription>
                      <CardTitle className="text-xl">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-xs text-muted-foreground">
                      {stat.delta}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <SectionShell
          id="features"
          heading={copy.features.title}
          subheading={copy.features.description}
          className="scroll-mt-24"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.features.items.map((feature, index) => {
              const Icon = featureIconMap[feature.title];

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
                >
                  <Card className="h-full border-border/80 transition hover:border-primary/40 hover:shadow-md">
                    <CardHeader className="gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent">
                        <Icon className="size-5 text-primary" />
                      </span>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </SectionShell>

        <SectionShell
          id="pricing"
          heading={copy.pricing.title}
          subheading={copy.pricing.description}
          className="scroll-mt-24"
        >
          <div className="grid gap-4 lg:grid-cols-4">
            {copy.pricing.tiers.map((tier, index) =>
              (() => {
                const isFeatured = "featured" in tier;

                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "relative h-full border-border/80 transition duration-200 hover:-translate-y-1 hover:shadow-lg",
                        isFeatured && "border-primary shadow-lg shadow-primary/10"
                      )}
                    >
                      {isFeatured ? (
                        <span className="absolute right-4 top-4 inline-flex rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                          Most Popular
                        </span>
                      ) : null}
                      <CardHeader>
                        <CardTitle>{tier.name}</CardTitle>
                        <p className="text-2xl font-semibold tracking-tight">{tier.price}</p>
                        <CardDescription>{tier.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex gap-2 text-muted-foreground">
                              <Check
                                className="mt-0.5 size-4 shrink-0 text-success"
                                aria-hidden="true"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="mt-6 w-full"
                          variant={isFeatured ? "default" : "outline"}
                        >
                          {tier.name === "Enterprise" ? "Contact Sales" : "Choose Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })()
            )}
          </div>
        </SectionShell>

        <SectionShell id="cta" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="surface-card bg-gradient-to-r from-card via-card to-secondary/40 px-6 py-10 sm:px-10"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="section-heading">{copy.cta.title}</h2>
                <p className="section-subheading mt-3">{copy.cta.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">{copy.cta.primaryCta}</Button>
                <Button size="lg" variant="outline">
                  {copy.cta.secondaryCta}
                </Button>
              </div>
            </div>
          </motion.div>
        </SectionShell>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2">
            <BrandMark />
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              FoodFlow is the cloud-native control layer for modern food operations across counters,
              kitchens, and outlets.
            </p>
          </div>

          <FooterColumn title="Product" links={copy.footer.product} />
          <FooterColumn title="Company" links={copy.footer.company} />
          <FooterColumn title="Legal" links={copy.footer.legal} />
        </div>
        <div className="border-t">
          <div className="container flex flex-col items-center justify-between gap-3 py-4 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} FoodFlow Technologies. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="LinkedIn" className="transition hover:text-foreground">
                LinkedIn
              </a>
              <a href="#" aria-label="X" className="transition hover:text-foreground">
                X
              </a>
              <a href="#" aria-label="YouTube" className="transition hover:text-foreground">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="#"
        className="fixed bottom-5 right-5 hidden rounded-full border bg-background px-3 py-2 text-xs text-muted-foreground shadow-sm transition hover:text-foreground sm:inline-flex"
      >
        Top
        <ChevronDown className="ml-1 size-4 -rotate-180" />
      </a>
    </div>
  );
}

type FooterColumnProps = {
  title: string;
  links: readonly string[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-foreground">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
