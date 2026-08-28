import {
  Brain,
  Code2,
  Layers,
  LineChart,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#team", label: "Team" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
] as const;

export const heroWords = ["Intelligent", "Reliable", "Practical"] as const;

export const stats = [
  { value: 48, suffix: "+", label: "AI systems shipped" },
  { value: 12, suffix: "M", label: "Predictions served / mo" },
  { value: 96, suffix: "%", label: "Client retention" },
  { value: 3, suffix: "wks", label: "Avg. prototype cycle" },
] as const;

export const services: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Brain,
    title: "AI product strategy",
    description:
      "Find the uses that matter most, define success, and chart a path from first try to a system you can run.",
  },
  {
    icon: Code2,
    title: "Custom AI applications",
    description:
      "Full-stack systems that embed models into real workflows—APIs, UIs, and the glue that makes them reliable.",
  },
  {
    icon: Layers,
    title: "Model engineering",
    description:
      "Retrieval, fine-tuning, evaluation harnesses, and guardrails so outputs stay accurate and on-brand.",
  },
  {
    icon: Sparkles,
    title: "Automation & agents",
    description:
      "Multi-step agents that research, draft, and act—with human checkpoints where judgment still matters.",
  },
  {
    icon: LineChart,
    title: "Analytics & insight",
    description:
      "Turn unstructured data into dashboards and decisions your team can trust every Monday morning.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability & safety",
    description:
      "Monitoring, red-teaming, privacy reviews, and fallback paths so AI features earn production trust.",
  },
];

export const skills = [
  { name: "LLM applications", level: 94 },
  { name: "Systems design", level: 90 },
  { name: "Data pipelines", level: 86 },
  { name: "Product design", level: 88 },
  { name: "Evaluation & QA", level: 92 },
  { name: "Cloud & DevOps", level: 85 },
] as const;

export const portfolio = [
  {
    id: "dropshipping",
    title: "Dropshipping site",
    category: "Product",
    summary:
      "End-to-end commerce storefront: catalog, cart, checkout, and fulfillment wiring for a dropshipping operation—shipped as a real store, not a mock.",
    href: "https://blaszyk.us/",
  },
  {
    id: "sals-barbershop",
    title: "Sal’s Barbershop",
    category: "Product",
    summary:
      "Local business web presence for Sal’s Barbershop—clear services, hours, and contact so customers can find the chair without the phone tag.",
    href: "https://blaszyk.us/",
  },
  {
    id: "unofficial-covid-report",
    title: "Unofficial COVID Report",
    category: "Analytics",
    summary:
      "Independent reporting site that gathered and presented COVID-related signals in plain language—fast updates when official channels lagged.",
    href: "https://unofficial-covid-report.acornsoft.ai/",
  },
  {
    id: "atlas",
    title: "Atlas Research Desk",
    category: "Product",
    summary: "Internal research agent that cites sources and drafts briefs in minutes.",
  },
  {
    id: "hearth",
    title: "Hearth Support Copilot",
    category: "Automation",
    summary: "Ticket triage and reply drafts that cut first-response time by half.",
  },
  {
    id: "ledger",
    title: "Ledger Insights",
    category: "Analytics",
    summary: "Natural-language queries over finance data with auditable SQL underneath.",
  },
  {
    id: "north",
    title: "Northbound Onboarding",
    category: "Product",
    summary: "Guided AI onboarding that personalizes setup for every new customer.",
  },
  {
    id: "signal",
    title: "Signal Review",
    category: "Safety",
    summary: "Content moderation stack with human-in-the-loop escalation paths.",
  },
  {
    id: "forge",
    title: "Forge Knowledge Base",
    category: "Automation",
    summary: "RAG system that keeps engineering docs answerable and up to date.",
  },
] as const;

export const portfolioFilters = [
  "All",
  "Product",
  "Automation",
  "Analytics",
  "Safety",
] as const;

export const team = [
  {
    name: "Avery Chen",
    role: "Founder & CEO",
    bio: "Former product lead at two AI startups. Builds teams that ship.",
  },
  {
    name: "Jordan Miles",
    role: "Head of Engineering",
    bio: "Distributed systems and model serving. Obsessed with latency and cost.",
  },
  {
    name: "Samira Patel",
    role: "Design Director",
    bio: "Turns complex model behavior into interfaces people actually enjoy.",
  },
  {
    name: "Noah Brooks",
    role: "Applied Research",
    bio: "Evaluation science and retrieval. Makes models measurable, not magical.",
  },
] as const;

export const plans = [
  {
    name: "Spark",
    price: 4_800,
    period: "project",
    description: "A focused sprint to validate one AI use case end to end.",
    features: [
      "Discovery workshop",
      "Working prototype",
      "Success metrics plan",
      "2 weeks of support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: 12_500,
    period: "month",
    description: "Embedded partnership to design, build, and ship production AI.",
    features: [
      "Dedicated pod",
      "Product + eng + design",
      "Eval & monitoring setup",
      "Weekly demos",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: null,
    period: "custom",
    description: "Multi-team programs, compliance review, and long-horizon roadmap.",
    features: [
      "Multiple workstreams",
      "Security & compliance",
      "On-call reliability",
      "Training for your team",
      "Custom SLAs",
    ],
    highlighted: false,
  },
] as const;

export const testimonials = [
  {
    quote:
      "Acornsoft turned a vague AI wishlist into a system our support team uses every day. Clear thinking, clean delivery.",
    name: "Elena Vargas",
    title: "VP Customer Ops, Northline",
  },
  {
    quote:
      "They treat evaluation as seriously as demos. Our board finally trusts the numbers behind the product.",
    name: "Marcus Hale",
    title: "CTO, Brightfield",
  },
  {
    quote:
      "Fast without being reckless. We shipped a research copilot in six weeks that still holds up a year later.",
    name: "Priya Nair",
    title: "Head of Product, Kite Labs",
  },
] as const;

export const faqs = [
  {
    q: "What kinds of AI projects do you take on?",
    a: "We are a New York–based AI-first organization focused on applied products—assistants, automation, analytics, and model-powered features inside real business workflows. We skip pure research with no path to production.",

  },
  {
    q: "How quickly can we start?",
    a: "Most engagements begin with a short discovery sprint. If scope is clear, we can usually staff a pod within two weeks.",
  },
  {
    q: "Do you work with our existing stack?",
    a: "Yes. We integrate with the tools and clouds you already run—whether that is Python services, modern JS frontends, or enterprise data platforms.",
  },
  {
    q: "How do you handle data privacy?",
    a: "We design for least privilege, isolate environments, and can operate under NDAs, DPAs, and industry-specific constraints. Your data never becomes our training corpus.",
  },
] as const;

export const contactInfo = {
  email: "hello@acornsoft.ai",
  phone: "+1 (212) 555-0148",
  address: "New York, NY",
} as const;
