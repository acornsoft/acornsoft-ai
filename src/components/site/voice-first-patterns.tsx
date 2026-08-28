import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Mic,
  MicOff,
  Volume2,
  MessageCircle,
  Mountain,
  Keyboard,
  Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ClimbNotesMark } from "./climb-notes-mark";
import {
  VOICE_NAME,
  VOICE_LABEL,
  VOICE_URL,
  SHERPA_LINE,
} from "./voice-access";

/** Luna voice session visual states — voice-first, captions always on. */
export type LunaVoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export type VoiceIntentId =
  | "find-note"
  | "explain-climb"
  | "business-problem"
  | "learn-metaphor";

const INTENTS: {
  id: VoiceIntentId;
  label: string;
  prompt: string;
}[] = [
  {
    id: "learn-metaphor",
    label: "Learn the climb",
    prompt: "Explain Climb Notes like I’m new to the mountain.",
  },
  {
    id: "find-note",
    label: "Find a Climb Note",
    prompt: "Help me find a Climb Note for my situation.",
  },
  {
    id: "business-problem",
    label: "Business problem",
    prompt: "I have a business problem — guide me to the right climb.",
  },
  {
    id: "explain-climb",
    label: "Walk me through",
    prompt: "Walk me through Base Camp, Route, Waypoint, and Summit.",
  },
];

const LUNA_REPLIES: Record<VoiceIntentId, string> = {
  "learn-metaphor":
    "Think of AI work as a mountain. Climb Notes are the trail map, so the whole team shares the same route.",
  "find-note":
    "Tell me what you’re trying to improve — customers, operations, or a product decision — and I’ll point you to published Climb Notes that fit.",
  "business-problem":
    "Start with the hard thing in plain language. We’ll pick one small step, a way to know it worked, and something you can ship this week.",
  "explain-climb":
    "Base Camp: are we fit to leave? Route: one objective and success marks. Waypoint: check the map, then hold or go. Summit: build, prove, bring evidence home. Four beats. Everyone can follow.",
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function stateLabel(state: LunaVoiceState): string {
  switch (state) {
    case "listening":
      return "Listening";
    case "thinking":
      return "Luna is thinking";
    case "speaking":
      return "Luna is speaking";
    case "error":
      return "Try again";
    default:
      return "Ready when you are";
  }
}

/** Pulsing orb — primary listen / speak affordance (mass-appeal, large target). */
export function LunaOrb({
  state,
  onPress,
  disabled,
  label = "Talk to Luna",
}: {
  state: LunaVoiceState;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={`ac-luna-orb ac-luna-orb--${state}`}
      onClick={onPress}
      disabled={disabled}
      aria-pressed={state === "listening" || state === "speaking"}
      aria-label={
        state === "listening"
          ? "Stop listening"
          : state === "speaking"
            ? "Stop Luna"
            : label
      }
    >
      <span className="ac-luna-orb-rings" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      <span className="ac-luna-orb-core" aria-hidden>
        {state === "listening" || state === "speaking" ? (
          <MicOff size={28} strokeWidth={2} />
        ) : state === "error" ? (
          <MicOff size={28} strokeWidth={2} />
        ) : (
          <Mic size={28} strokeWidth={2} />
        )}
      </span>
      <span className="ac-luna-orb-label">{label}</span>
    </button>
  );
}

/** Always-on captions — voice-first never means captions-off. */
export function VoiceCaptions({
  you,
  luna,
  live,
}: {
  you: string;
  luna: string;
  live?: string;
}) {
  return (
    <div className="ac-voice-captions" aria-live="polite" aria-atomic="false">
      <div className="ac-voice-caption-row">
        <span className="ac-voice-caption-who">You</span>
        <p className="ac-voice-caption-text">
          {live || you || "Tap the mic or pick a prompt below."}
        </p>
      </div>
      <div className="ac-voice-caption-row ac-voice-caption-row--luna">
        <span className="ac-voice-caption-who">
          {VOICE_NAME}
        </span>
        <p className="ac-voice-caption-text">
          {luna ||
            `I’m ${SHERPA_LINE} — Luna and Ara are the same voice on Grok Voice. Ask in everyday words.`}
        </p>
      </div>
    </div>
  );
}

/** Intent chips — teach the metaphor without requiring perfect speech. */
export function VoiceIntentChips({
  active,
  onPick,
  disabled,
}: {
  active?: VoiceIntentId | null;
  onPick: (id: VoiceIntentId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="ac-voice-intents" role="group" aria-label="Try saying">
      <p className="ac-voice-intents-kicker">Try saying</p>
      <ul className="ac-voice-intent-list">
        {INTENTS.map((intent) => (
          <li key={intent.id}>
            <button
              type="button"
              className={
                active === intent.id
                  ? "ac-voice-intent is-active"
                  : "ac-voice-intent"
              }
              disabled={disabled}
              onClick={() => onPick(intent.id)}
            >
              {intent.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pattern legend — documents voice-first rules in-product. */
export function VoiceFirstPatternLegend() {
  const patterns = [
    {
      icon: Mic,
      title: "One obvious talk control",
      body: "A single large mic. Tap to talk; tap again to stop.",
    },
    {
      icon: MessageCircle,
      title: "Captions always on",
      body: "Voice-first still shows what was said and what Luna answered. Quiet rooms and shared screens stay usable.",
    },
    {
      icon: Sparkles,
      title: "Guided prompts",
      body: "Everyday chips teach the climb before free speech.",
    },
    {
      icon: Keyboard,
      title: "Type sits beside the mic",
      body: "Text entry is there when speech isn’t available or preferred.",
    },
    {
      icon: Mountain,
      title: "Climb Notes as destinations",
      body: "Luna routes people to journal trails.",
    },
    {
      icon: Volume2,
      title: "Speaking state is visible",
      body: "When Luna talks, motion and status say so — so people know who has the floor.",
    },
  ];

  return (
    <div className="ac-voice-patterns">
      <header className="ac-voice-patterns-head">
        <p className="ac-voice-patterns-kicker">Voice-first UX</p>
        <h2 className="ac-voice-patterns-title">
          Patterns for {SHERPA_LINE}
        </h2>
        <p className="ac-voice-patterns-lede">
          Designed for everyone learning Climb Notes.{" "}
          <strong>Luna and Ara are one and the same</strong> —{" "}
          <strong>{VOICE_LABEL}</strong>
          . Voice leads; sight and text stay first-class.
        </p>
      </header>
      <ul className="ac-voice-pattern-grid">
        {patterns.map((p) => (
          <li key={p.title} className="ac-voice-pattern-card">
            <span className="ac-voice-pattern-icon" aria-hidden>
              <p.icon size={20} strokeWidth={1.85} />
            </span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Interactive Luna dock — prototype of the voice-first session surface.
 * Uses Web Speech API when present; always supports chips + type.
 */
export function LunaVoiceDock() {
  const [state, setState] = useState<LunaVoiceState>("idle");
  const [you, setYou] = useState("");
  const [live, setLive] = useState("");
  const [luna, setLuna] = useState(
    `Hi — I’m ${SHERPA_LINE}. Luna and Ara are the same voice on Grok Voice. Tell me what you’re trying to climb, in plain language.`,
  );
  const [activeIntent, setActiveIntent] = useState<VoiceIntentId | null>(null);
  const [typed, setTyped] = useState("");
  const [speechOk, setSpeechOk] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const inputId = useId();

  useEffect(() => {
    setSpeechOk(Boolean(getSpeechRecognition()));
  }, []);

  const speak = useCallback((text: string) => {
    setLuna(text);
    setState("speaking");
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1;
        u.pitch = 1;
        u.onend = () => setState("idle");
        u.onerror = () => setState("idle");
        window.speechSynthesis.speak(u);
        return;
      }
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setState("idle"), 2200);
  }, []);

  const respondTo = useCallback(
    (text: string, intent?: VoiceIntentId | null) => {
      setYou(text);
      setLive("");
      setState("thinking");
      const reply =
        (intent && LUNA_REPLIES[intent]) ||
        (text.toLowerCase().includes("problem")
          ? LUNA_REPLIES["business-problem"]
          : text.toLowerCase().includes("explain") ||
              text.toLowerCase().includes("walk")
            ? LUNA_REPLIES["explain-climb"]
            : text.toLowerCase().includes("find") ||
                text.toLowerCase().includes("note")
              ? LUNA_REPLIES["find-note"]
              : LUNA_REPLIES["learn-metaphor"]);
      window.setTimeout(() => speak(reply), 480);
    },
    [speak],
  );

  const stopAll = useCallback(() => {
    try {
      recRef.current?.abort();
    } catch {
      /* ignore */
    }
    recRef.current = null;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    setLive("");
    setState("idle");
  }, []);

  const startListen = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setState("error");
      setLuna(
        "This browser can’t hear the mic yet — type your question, or use a prompt chip.",
      );
      return;
    }
    stopAll();
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (ev) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (!r) continue;
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (interim) setLive(interim);
      if (final) {
        setLive("");
        respondTo(final.trim());
      }
    };
    rec.onerror = () => {
      setState("error");
      setLuna("I couldn’t hear clearly — try a chip, or type a short line.");
    };
    rec.onend = () => {
      setState((s) => (s === "listening" ? "idle" : s));
    };
    recRef.current = rec;
    try {
      rec.start();
      setState("listening");
      setLive("Listening…");
    } catch {
      setState("error");
      setLuna("Mic didn’t start — type instead, or pick a prompt.");
    }
  }, [respondTo, stopAll]);

  const onOrb = () => {
    if (state === "listening" || state === "speaking" || state === "thinking") {
      stopAll();
      return;
    }
    startListen();
  };

  const onIntent = (id: VoiceIntentId) => {
    const intent = INTENTS.find((x) => x.id === id);
    if (!intent) return;
    setActiveIntent(id);
    respondTo(intent.prompt, id);
  };

  const onTypeSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = typed.trim();
    if (!t) return;
    setTyped("");
    setActiveIntent(null);
    respondTo(t);
  };

  return (
    <section
      className="ac-luna-dock"
      aria-label="Talk to Luna — voice-first prototype"
    >
      <div className="ac-luna-dock-inner">
        <div className="ac-luna-dock-intro">
          <p className="ac-luna-dock-kicker">
            Voice-first · {VOICE_LABEL}
          </p>
          <h2 className="ac-luna-dock-title">
            {SHERPA_LINE}
          </h2>
          <p className="ac-luna-dock-lede">
            Describe a problem or goal in everyday words.{" "}
            <strong>Luna and Ara are one and the same</strong> — your Sherpa on
            Grok Voice (<strong>{VOICE_LABEL}</strong>). Education and alignment
            first, then the right <ClimbNotesMark /> trail. This on-site preview
            uses your device mic when available.
          </p>
          <p className="ac-luna-dock-status" data-state={state}>
            <span className="ac-luna-dock-status-dot" aria-hidden />
            {stateLabel(state)}
            {!speechOk ? " · type or chips work here" : null}
          </p>
        </div>

        <div className="ac-luna-dock-stage">
          <LunaOrb state={state} onPress={onOrb} />
          <VoiceCaptions you={you} luna={luna} live={live} />
        </div>

        <VoiceIntentChips
          active={activeIntent}
          onPick={onIntent}
          disabled={state === "listening"}
        />

        <form className="ac-luna-type" onSubmit={onTypeSubmit}>
          <label className="ac-luna-type-label" htmlFor={inputId}>
            Or type a short question
          </label>
          <div className="ac-luna-type-row">
            <input
              id={inputId}
              className="ac-luna-type-input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="e.g. Help my team stop random AI pilots"
              autoComplete="off"
            />
            <button type="submit" className="rn-btn ac-btn-maroon ac-luna-type-go">
              <span>Ask Luna</span>
            </button>
          </div>
        </form>

        <p className="ac-luna-dock-foot">
          Full sessions:{" "}
          <a href={VOICE_URL} target="_blank" rel="noopener noreferrer">
            Grok Voice · {VOICE_NAME}
          </a>
          . Also: Content Studio on X, video walkthroughs, deeper Climb Note
          matching.{" "}
          <Link to="/climb-notes">Browse the journal</Link>
          {" · "}
          <Link to="/canopy">Canopy</Link>
          {" · "}
          <Link to="/service">Services</Link>
        </p>
      </div>
    </section>
  );
}

/** Full home block: pattern legend + interactive dock */
export function VoiceFirstHomeSection() {
  return (
    <div className="ac-voice-first-home">
      <div className="container">
        <VoiceFirstPatternLegend />
        <LunaVoiceDock />
      </div>
    </div>
  );
}
