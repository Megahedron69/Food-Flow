export const defaultLocale = "en" as const;

export const landingCopy = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      login: "Login",
      primaryCta: "Book a Demo"
    },
    hero: {
      eyebrow: "Cloud-native restaurant infrastructure",
      title: "Run every outlet in flow, from billing to kitchen in realtime.",
      description:
        "FoodFlow helps restaurants, cafes, cloud kitchens, food courts, and QSR chains run faster with offline-first POS, GST-ready billing, inventory control, and live kitchen coordination.",
      primaryCta: "Start Free Trial",
      secondaryCta: "See Pricing",
      highlights: [
        "Offline-first billing",
        "Multi-outlet controls",
        "GST-ready receipts",
        "Realtime kitchen updates"
      ]
    },
    features: {
      title: "Everything your floor and back office need",
      description:
        "FoodFlow keeps service fast on the counter while giving managers clear operational control.",
      items: [
        {
          title: "Touchscreen POS Billing",
          description: "Fast checkout flows designed for busy counters and high-order throughput."
        },
        {
          title: "Offline Billing",
          description:
            "Continue billing during network drops and auto-sync when connectivity returns."
        },
        {
          title: "GST-Compliant Receipts",
          description: "Generate clean, tax-ready invoices with configurable GST settings."
        },
        {
          title: "Multi-Outlet Management",
          description: "Control menus, pricing, and performance across all branches in one place."
        },
        {
          title: "Inventory Tracking",
          description: "Track stock movement and reduce wastage with live usage visibility."
        },
        {
          title: "Role-Based Staff Access",
          description:
            "Grant access by role so cashiers, kitchen staff, and managers see what they need."
        },
        {
          title: "Live Kitchen Updates",
          description: "Send orders to KDS in realtime and reduce communication delays."
        },
        {
          title: "Reporting & Analytics",
          description: "Monitor sales, peak hours, and outlet performance with actionable insights."
        }
      ]
    },
    pricing: {
      title: "Simple pricing for every growth stage",
      description:
        "Start lean, scale to multiple outlets, and unlock enterprise controls when needed.",
      tiers: [
        {
          name: "Starter",
          price: "INR 799/month",
          description: "For single-outlet teams launching digital billing.",
          features: ["POS billing", "Basic menu management", "1 user", "PDF reports"]
        },
        {
          name: "Growth",
          price: "INR 1,499/month",
          description: "For growing kitchens standardizing operations.",
          featured: true,
          features: ["Inventory management", "KDS", "Advanced reports", "CRM basic", "5 users"]
        },
        {
          name: "Pro",
          price: "INR 2,499/month",
          description: "For multi-channel brands with deeper automation.",
          features: [
            "Loyalty program",
            "QR ordering",
            "Online ordering",
            "Unlimited users",
            "API access"
          ]
        },
        {
          name: "Enterprise",
          price: "Custom Pricing",
          description: "For large chains with advanced integrations.",
          features: [
            "Aggregator integrations",
            "ERP sync",
            "Dedicated support",
            "SLA guarantee",
            "White-labeling"
          ]
        }
      ]
    },
    cta: {
      title: "Bring speed and control to every service hour.",
      description:
        "See FoodFlow in action and get a rollout plan built for your outlet size, team structure, and growth goals.",
      primaryCta: "Book a Live Demo",
      secondaryCta: "Talk to Sales"
    },
    footer: {
      product: ["Features", "Pricing", "Security", "Roadmap"],
      company: ["About", "Customers", "Careers", "Contact"],
      legal: ["Privacy", "Terms", "DPA", "Compliance"]
    }
  }
} as const;

export type LandingLocale = keyof typeof landingCopy;
