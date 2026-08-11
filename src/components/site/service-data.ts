import {
  Brain,
  Code2,
  GraduationCap,
  Layers,
  LineChart,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Concrete deliverables / outcomes on the card. */
  points: string[];
  /** How help is offered: direct engagement vs enablement / public trails. */
  assistance: "direct" | "indirect" | "both";
};

/** One card per engagement type on /service. */
export const services: ServiceItem[] = [
  {
    icon: GraduationCap,
    title: "Learn the Climb",
    assistance: "indirect",
    description:
      "Indirect help first: learn the four shared words—problem, measure, slice, lesson—so AI work becomes a climb you can finish and reuse, not only a developer craft. You climb with Luna as your Sherpa; prior Climb Notes guide the next path—same mountain or a new one.",
    points: [
      "Climb Notes™ literacy for leaders, operators, creators, and builders",
      "Walkthroughs and examples that make problem → measure → slice → lesson real",
      "Path into Grok Voice with Luna (Ara) as your Sherpa — one voice on your climb",
      "Prior Climb Notes as guidelines for future climbs (same path or new)",
      "Content and journal trails people can re-ascend without us in the room",
    ],
  },
  {
    icon: Brain,
    title: "Artificial Intelligence Strategy",
    assistance: "direct",
    description:
      "Direct assistance on the mountain you should climb. We map workflows, data reality, risk, and success measures so pilots have a path to production—not a slide deck that dies after the demonstration.",
    points: [
      "Use-case ranking with effort, value, and risk",
      "Clear measures of success (and what “done” means)",
      "Pilot-to-production roadmap with owners and checkpoints",
      "Build, buy, or wait recommendations grounded in constraints",
    ],
  },
  {
    icon: Code2,
    title: "Product Build",
    assistance: "direct",
    description:
      "Direct build on a thin vertical: full-stack artificial intelligence applications inside real work—interfaces, authentication, data paths, and the glue that keeps models useful for actual users.",
    points: [
      "End-to-end product slices you can ship and operate",
      "Interfaces that match how teams already work",
      "Application interfaces, storage, and deployment paths ready for load",
      "Handoff documents so your team can run and extend the system",
    ],
  },
  {
    icon: Layers,
    title: "Model Systems",
    assistance: "direct",
    description:
      "Direct assistance on the technical pitch: retrieval, evaluation, guardrails, and monitoring that hold up under traffic and audit. The model is one component of a system—not the whole product.",
    points: [
      "Retrieval and tool wiring with sourceable answers",
      "Evaluation harnesses and regression checks before release",
      "Guardrails for tone, policy, and unsafe outputs",
      "Observability so drift and failures show up early",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Trust and Safety",
    assistance: "both",
    description:
      "Direct design of safe production paths, plus patterns your team can reuse. Privacy, reliability, and human judgment where it matters—so the climb does not become a free solo on high stakes.",
    points: [
      "Data handling and access patterns that match policy",
      "Human checkpoints on high-stakes actions",
      "Fallback paths when the model is wrong or offline",
      "Reviewable logs for incidents and audits",
    ],
  },
  {
    icon: Sparkles,
    title: "Automation",
    assistance: "direct",
    description:
      "Direct assistance with agents and multi-step workflows—clear handoffs, not black boxes. Supervised autonomy: research, draft, act—with humans still accountable for outcomes.",
    points: [
      "Task agents with defined tools and boundaries",
      "Workflows that pass work to people at the right step",
      "Queues, retries, and status the team can trust",
      "Escalation rules when confidence or policy says stop",
    ],
  },
  {
    icon: LineChart,
    title: "Delivery with Climb Notes™",
    assistance: "both",
    description:
      "Direct delivery and indirect enablement: Climb Notes structure the climb—problem, measure, slice, lesson—so every engagement leaves a trail the next team can re-ascend.",
    points: [
      "Climb Notes as the delivery record (not optional theater)",
      "Thin vertical slices that prove value under real load",
      "Publish and measure loops with explicit owners",
      "Lessons written back so the next climb starts smarter",
    ],
  },
];

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
    a: "A Climb Note is one finished climb written so the next person can follow it. Four steps in order: Problem (what’s stuck), Measure (how we know it moved), Slice (the small step), and Lesson (what we carry next). Climb Notes are how we teach and deliver production AI—systems you can run and improve, not demos that vanish after a showcase.",
  },
  {
    id: "mountaineering-approach",
    defaultOrder: 1,
    q: "What does “Mountaineering approach” actually mean?",
    a: "Four plain steps on every Climb Note: what’s stuck (Problem), how you know it moved (Measure), the small step this week (Slice), and what you carry next time (Lesson). Luna is your Sherpa on Voice. Prior notes guide the next climb—same path or new. That is AI-first solutioning in everyday language, not a slide metaphor.",
  },
  {
    id: "how-help-use",
    defaultOrder: 2,
    q: "How do you help people use it?",
    a: "Through Climb Notes™, walkthroughs, and Grok Voice with Luna (Ara) as your Sherpa—indirect help anyone can follow. Paid work then applies the same four steps on your mountain: strategy, build, and delivery with a trail map you keep.",
  },
  {
    id: "direct-vs-indirect",
    defaultOrder: 3,
    q: "What is direct versus indirect assistance?",
    a: "Indirect: education, public Climb Notes, and guided Voice so you climb with a map—not alone without history. Direct: we help on strategy, product build, model systems, automation, trust, and delivery for your specific mountain, using prior climbs as guidelines when they apply.",
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
    a: "Often with Learn the Climb or a short discovery slice: one problem, one measure, one thin vertical. If that works, we stack Product Build, Model Systems, Trust and Safety, Automation, or Delivery as the climb demands—modular, not a large fixed program by default.",
  },
  {
    id: "one-card",
    defaultOrder: 6,
    q: "Can we start with only one card?",
    a: "Yes. Many start with Learn the Climb, Artificial Intelligence Strategy, or a single Product Build slice. Stack services only when the next constraint is clear. Small starts, strong roots.",
  },
];
