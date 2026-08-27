import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled } from "@/lib/auth/client";
import { getVoiceAccess } from "@/lib/auth/voice-access";
import { sessionMemory } from "@/lib/auth/session-memory";

/** Grok Voice entry for Acornsoft sessions. */
export const VOICE_URL = "https://grok.x.ai/";

const envVoiceName =
  typeof import.meta !== "undefined"
    ? (import.meta as ImportMeta & { env?: Record<string, string> }).env
        ?.VITE_ACORNSOFT_VOICE_NAME
    : undefined;

export const VOICE_IDENTITY = envVoiceName?.trim() || "Luna";

export const VOICE_IS_LUNA_ARA = [
  "luna",
  "ara",
  "luna (ara)",
  "luna/ara",
].includes(String(VOICE_IDENTITY).toLowerCase());

export const VOICE_NAME = VOICE_IS_LUNA_ARA ? "Luna (Ara)" : VOICE_IDENTITY;

export const VOICE_LABEL = VOICE_IS_LUNA_ARA
  ? "Luna (Ara) on Grok Voice"
  : `${VOICE_IDENTITY} on Grok Voice`;

export const SHERPA_LINE = "Luna as your Sherpa";

export const VOICE_SPEAKER = VOICE_NAME;
export const VOICE_SPEAKER_LABEL = VOICE_LABEL;
export const SHERPA_GUIDE_LINE = SHERPA_LINE;
export const SHERPA_GUIDE = "Luna";

export const VOICE_OPEN_LABEL = "ACORNSOFT is OPEN";

function rememberedVoiceAllowed(userId: string | null): boolean {
  return Boolean(
    userId &&
      sessionMemory.voice &&
      sessionMemory.voice.userId === userId &&
      sessionMemory.voice.allowed,
  );
}

/** Voice UI is hidden until the visitor is signed in. */
export function useVoiceVisible(): {
  visible: boolean;
  isPending: boolean;
  signedIn: boolean;
} {
  const { user, isPending } = useCurrentUserState();
  const signedIn = !!user;
  return {
    visible: signedIn,
    isPending,
    signedIn,
  };
}

/** Renders children only when signed in (hides Voice entry points when logged out). */
export function VoiceWhenSignedIn({ children }: { children: ReactNode }) {
  const { visible } = useVoiceVisible();
  if (!visible) return null;
  return <>{children}</>;
}

export function useVoiceAccessState(): {
  allowed: boolean;
  isPending: boolean;
  signedIn: boolean;
} {
  const { user, isPending: sessionPending } = useCurrentUserState();
  const userId = user?.id ?? null;
  const isDev = Boolean(user?.isDevFallback);
  const [allowed, setAllowed] = useState(() => rememberedVoiceAllowed(userId));
  const [checking, setChecking] = useState(false);
  const knownId = useRef<string | null>(
    rememberedVoiceAllowed(userId) ? userId : null,
  );

  useEffect(() => {
    if (sessionPending) return;
    if (!authEnabled) {
      knownId.current = userId;
      if (userId) sessionMemory.voice = { userId, allowed: true };
      setAllowed(true);
      setChecking(false);
      return;
    }
    if (!userId) {
      knownId.current = null;
      sessionMemory.voice = null;
      setAllowed(false);
      setChecking(false);
      return;
    }
    if (isDev) {
      knownId.current = userId;
      sessionMemory.voice = { userId, allowed: true };
      setAllowed(true);
      setChecking(false);
      return;
    }
    if (knownId.current === userId || rememberedVoiceAllowed(userId)) {
      knownId.current = userId;
      setAllowed(true);
      setChecking(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    void getVoiceAccess()
      .then((r) => {
        if (cancelled) return;
        const ok = Boolean(r.allowed);
        knownId.current = userId;
        sessionMemory.voice = { userId, allowed: ok };
        setAllowed(ok);
      })
      .catch(() => {
        if (cancelled) return;
        // Transient miss: keep the last answer so the header does not blink.
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, sessionPending, isDev]);

  const cached = rememberedVoiceAllowed(userId);
  const visibleAllowed = allowed || cached;
  return {
    allowed: visibleAllowed,
    isPending: sessionPending || (checking && !visibleAllowed),
    signedIn: Boolean(userId),
  };
}

type VoiceLinkProps = {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
};

/** External Voice control — only when signed in with X / voice access. */
export function VoiceLink({
  className,
  children = VOICE_OPEN_LABEL,
  style,
  onClick,
}: VoiceLinkProps) {
  const { allowed, isPending } = useVoiceAccessState();
  if (isPending || !allowed) return null;
  return (
    <a
      className={className}
      href={VOICE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      onClick={onClick}
      title={`Open Grok Voice — ${VOICE_LABEL}`}
      aria-label={`Open Grok Voice with ${VOICE_NAME}`}
    >
      {children}
    </a>
  );
}

export function VoiceCta({
  className = "rn-btn",
  label = VOICE_OPEN_LABEL,
  outline = false,
}: {
  className?: string;
  label?: string;
  signedOutLabel?: string;
  outline?: boolean;
}) {
  const { allowed, isPending } = useVoiceAccessState();
  const cls = outline ? `${className} ac-btn-outline` : className;

  if (isPending) {
    // No placeholder glyph — bare "…" looked like a second scroll control
    return null;
  }

  if (!allowed) return null;

  return (
    <a
      className={`${cls} ac-voice-open`.trim()}
      href={VOICE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${VOICE_OPEN_LABEL} — ${VOICE_LABEL}`}
      title={VOICE_LABEL}
    >
      <span>{label}</span>
    </a>
  );
}

export function VoiceHeaderButton({
  className = "rn-btn d-none d-md-inline-flex ac-voice-open",
}: {
  className?: string;
}) {
  return (
    <VoiceLink className={className}>
      <span>{VOICE_OPEN_LABEL}</span>
    </VoiceLink>
  );
}

/** Internal /voice link — only when signed in. */
export function VoicePageLink({
  className,
  children = "Talk to Luna",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { visible } = useVoiceVisible();
  if (!visible) return null;
  return (
    <Link className={className} to="/voice">
      {children}
    </Link>
  );
}
