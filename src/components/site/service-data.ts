import {
  Brain,
  Code2,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  /** Stable id — do not recycle if a card is composed or retired from the public baseline. */
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Concrete deliverables / outcomes on the card. */
  points: string[];
  /** How help is offered: direct engagement vs enablement / public trails. */
  assistance: "direct" | "indirect" | "both";
  /** If set, this public card is composed from catalog ids (nothing deleted). */
  composedFrom?: string[];
};

/**
 * Full catalog — every service we have defined.
 * Do not delete entries. The public page shows `baselineServices` (6),
 * composed from this list so copy and outcomes stay recoverable.
 */
export const serviceCatalog: ServiceItem[] = [
  {
    id: "learn-the-climb",
    icon: GraduationCap,
    title: "Learn the Climb",
    assistance: "indirect",
    description:
      "Indirect help first: learn the four shared words—problem, measure, pitch, lesson—so a shop owner and an engineer can follow the same climb. Climb Notes™ are that crossover, not only a developer craft. You climb with Luna as your Sherpa; prior notes guide the next path.",
    points: [
      "Climb Notes™ literacy for leaders, operators, creators, and builders",
      "Walkthroughs and examples that make problem → measure → pitch → lesson real",
      "Path into Grok Voice with Luna (Ara) as your Sherpa — one voice on your climb",
      "Prior Climb Notes as guidelines for future climbs (same path or new)",
      "Content and journal trails people can re-ascend without us in the room",
    ],
  },
  {
    id: "ai-strategy",
    icon: Brain,
    title: "Artificial Intelligence Strategy",
    assistance: "direct",
    description:
      "We map the mountain you should climb—workflows, risk, and what “done” means—so a pilot has a path to production.",
    points: [
      "Use-case ranking with effort, value, and risk",
      "Clear measures of success (and what “done” means)",
      "Pilot-to-production roadmap with owners and checkpoints",
      "Build, buy, or wait recommendations grounded in constraints",
    ],
  },
  {
    id: "product-build",
    icon: Code2,
    title: "Product Build",
    assistance: "direct",
    description:
      "A thin vertical you can ship: the app, the data path, and the glue that keeps a model useful for real users.",
    points: [
      "End-to-end product slices you can ship and operate",
      "Interfaces that match how teams already work",
      "Application interfaces, storage, and deployment paths ready for load",
      "Handoff documents so your team can run and extend the system",
    ],
  },
  {
    id: "model-systems",
    icon: Layers,
    title: "Model Systems",
    assistance: "direct",
    description:
      "Retrieval, evaluation, guardrails, and monitoring. The model is one part of a system—not the whole product.",
    points: [
      "Retrieval and tool wiring with sourceable answers",
      "Evaluation harnesses and regression checks before release",
      "Guardrails for tone, policy, and unsafe outputs",
      "Observability so drift and failures show up early",
    ],
  },
  {
    id: "trust-and-safety",
    icon: ShieldCheck,
    title: "Trust and Safety",
    assistance: "both",
    description:
      "Safe production paths your team can reuse—privacy, judgment, and a way down when the model is wrong.",
    points: [
      "Data handling and access patterns that match policy",
      "Human checkpoints on high-stakes actions",
      "Fallback paths when the model is wrong or offline",
      "Reviewable logs for incidents and audits",
    ],
  },
  {
    id: "automation",
    icon: Sparkles,
    title: "Automation",
    assistance: "direct",
    description:
      "Agents and workflows with clear handoffs. Supervised autonomy: research, draft, act—humans stay accountable.",
    points: [
      "Task agents with defined tools and boundaries",
      "Workflows that pass work to people at the right step",
      "Queues, retries, and status the team can trust",
      "Escalation rules when confidence or policy says stop",
    ],
  },
  {
    id: "delivery-climb-notes",
    icon: LineChart,
    title: "Delivery with Climb Notes™",
    assistance: "both",
    description:
      "Direct delivery and indirect enablement: Climb Notes structure the climb—problem, measure, pitch, lesson—so a non-technical owner and a builder can follow the same trail.",
    points: [
      "Climb Notes as the delivery record (not optional theater)",
      "Thin vertical slices that prove value under real load",
      "Publish and measure loops with explicit owners",
      "Lessons written back so the next climb starts smarter",
    ],
  },
];

const catalogById = Object.fromEntries(
  serviceCatalog.map((s) => [s.id, s]),
) as Record<string, ServiceItem>;

function must(id: string): ServiceItem {
  const s = catalogById[id];
  if (!s) throw new Error(`Unknown service catalog id: ${id}`);
  return s;
}

/**
 * Public baseline (6). Delivery is not dropped — it is the method inside
 * Learn the Climb (literacy + the trail every engagement leaves).
 * Card copy is first-principles: Does + Why on the front, You get on the back.
 */
export const baselineServices: ServiceItem[] = [
  {
    id: "learn-the-climb",
    icon: GraduationCap,
    title: "Learn the Climb",
    assistance: "both",
    composedFrom: ["learn-the-climb", "delivery-climb-notes"],
    description:
      "Does: teach you to write one finished AI job as Problem → Measure → Slice → Lesson. Why: without that, tools pile up and you cannot tell if the work got better.",
    points: [
      "The four-step template",
      "Public notes you can copy",
      "Voice with Luna to walk a note",
      "The same write-up used when we do paid work",
    ],
  },
  {
    id: "ai-strategy",
    icon: Brain,
    title: "Artificial Intelligence Strategy",
    assistance: "direct",
    description:
      "Does: choose which AI job to do first, and what “done” means. Why: most pilots die because nobody ranked effort, value, and risk — or named a measure.",
    points: [
      "Ranked use cases",
      "A written definition of done",
      "A path from pilot to production with owners",
      "Build, buy, or wait",
    ],
  },
  {
    id: "product-build",
    icon: Code2,
    title: "Product Build",
    assistance: "direct",
    description:
      "Does: ship one working slice — screen, login, data, model, deploy. Why: a demo is not a product. Users cannot use a slide.",
    points: [
      "A running slice in your workflow",
      "The repo and how to run it",
      "A handoff so your people can change it",
    ],
  },
  {
    id: "model-systems",
    icon: Layers,
    title: "Model Systems",
    assistance: "direct",
    description:
      "Does: put the model inside a system that can be tested and watched. Why: a model alone cannot cite a source, fail a test, or tell you it drifted.",
    points: [
      "Retrieval with sources",
      "Evals before release",
      "Output limits",
      "Logs when it breaks",
    ],
  },
  {
    id: "trust-and-safety",
    icon: ShieldCheck,
    title: "Trust and Safety",
    assistance: "both",
    description:
      "Does: decide what the system may do, who must approve it, and what happens when it is wrong. Why: high-stakes actions without a human stop or an audit trail become incidents.",
    points: [
      "Data rules",
      "Human checkpoints",
      "A fallback when the model is down or wrong",
      "Logs you can review",
    ],
  },
  {
    id: "automation",
    icon: Sparkles,
    title: "Automation",
    assistance: "direct",
    description:
      "Does: have software take the next step — with a person still on the hook. Why: an agent with no boundary will act when it should stop.",
    points: [
      "Agents with listed tools",
      "Handoff to a person at a named step",
      "Retries and status you can see",
      "A stop rule",
    ],
  },
];

/** @deprecated Use baselineServices on the public page; serviceCatalog is the full archive. */
export const services = baselineServices;

export type ServiceFaq = {
  /** Stable id for click ranking (do not change casually). */
  id: string;
  q: string;
  a: string;
  /** Lower = higher when click counts are equal (0 = default first). */
  defaultOrder: number;
};

export const serviceFaqs: ServiceFaq[] = [
  {
    id: "what-is-climb-notes",
    defaultOrder: 0,
    q: "What is a Climb Note?",
    a: "A Climb Note is one finished climb written so the next person can follow it — whether they write code or not. Four steps in order: Problem (what’s stuck), Measure (how we know it moved), Pitch (the next safe rope length), and Lesson (what we carry next). That crossover is the point. Climb Notes are how we teach and deliver production AI — not demos that vanish after a showcase.",
  },
  {
    id: "crossover",
    defaultOrder: 1,
    q: "Why do Climb Notes matter if I am not a developer?",
    a: "Because the same four moves work on both sides of the table. A shop owner and an engineer can write the same note, and both can follow it. That crossover is the point. Gnomah is our second brain. Grok-based tools run the pitch. We use that trail to aim for about twenty times a normal cycle — and the journal is how we show it.",
  },
  {
    id: "mountaineering-approach",
    defaultOrder: 1,
    q: "What does “Mountaineering approach” actually mean?",
    a: "Four plain steps on every Climb Note: what’s stuck (Problem), how you know it moved (Measure), the next safe pitch (Pitch), and what you carry next time (Lesson). Same words for a shop owner and an engineer. Luna is your Sherpa on Voice. Gnomah is our second brain. Grok-based tools run the pitch. This is the way.",
  },
  {
    id: "how-help-use",
    defaultOrder: 2,
    q: "How do you help people use it?",
    a: "Through Climb Notes™, walkthroughs, and Grok Voice with Luna (Ara) as your Sherpa—indirect help anyone can follow. Paid work then applies the same four steps on your mountain: strategy, build, systems, automation, and trust, with a trail map you keep.",
  },
  {
    id: "direct-vs-indirect",
    defaultOrder: 3,
    q: "What is direct versus indirect assistance?",
    a: "Indirect: education, public Climb Notes, and guided Voice so you climb with a map—not alone without history. Direct: we help on strategy, product build, model systems, automation, and trust for your specific mountain. Delivery is not a seventh service—it is Climb Notes running through every engagement.",
  },
  {
    id: "kinds-of-projects",
    defaultOrder: 4,
    q: "What kinds of artificial intelligence projects do you take on?",
    a: "Applied artificial intelligence products—assistants, automation, analytics, and model-powered features inside real business workflows. We skip pure research with no path to production, and we prefer problems where success can be measured.",
  },
  {
    id: "engagements-start",
    defaultOrder: 5,
    q: "How do engagements start?",
    a: "Often with Learn the Climb or a short discovery slice: one problem, one measure, one thin vertical. If that works, we stack Strategy, Product Build, Model Systems, Trust and Safety, or Automation as the climb demands—modular, not a large fixed program by default.",
  },
  {
    id: "one-card",
    defaultOrder: 6,
    q: "Can we start with only one card?",
    a: "Yes. Many start with Learn the Climb, Artificial Intelligence Strategy, or a single Product Build slice. Stack services only when the next constraint is clear. Small starts, strong roots.",
  },
  {
    id: "six-baseline",
    defaultOrder: 7,
    q: "Why six services, not seven?",
    a: "Six is the public baseline: Learn the Climb, Strategy, Product Build, Model Systems, Trust and Safety, and Automation. Delivery with Climb Notes is how those six run—the trail inside Learn the Climb and every paid engagement—not a separate seventh offer. The full catalog is still kept so nothing is thrown away.",
  },
];
