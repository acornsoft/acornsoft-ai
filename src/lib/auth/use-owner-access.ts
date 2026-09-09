import { useEffect, useState } from "react";
import { getClimbNotesAccess } from "@/lib/climb-notes/actions";
import { useCurrentUserState } from "./use-current-user";

/**
 * Founder gate for chrome. True only when the signed-in X identity is
 * @acornsoftai (same check Gnomah uses). Sign-in alone is not enough.
 */
export function useOwnerAccess(): {
  isOwner: boolean;
  signedIn: boolean;
  isPending: boolean;
} {
  const { user, isPending: sessionPending } = useCurrentUserState();
  const [isOwner, setIsOwner] = useState(false);
  const [ownerPending, setOwnerPending] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOwner(false);
      setOwnerPending(false);
      return;
    }
    let cancelled = false;
    setOwnerPending(true);
    void getClimbNotesAccess()
      .then((access) => {
        if (!cancelled) setIsOwner(Boolean(access.isOwner));
      })
      .catch(() => {
        if (!cancelled) setIsOwner(false);
      })
      .finally(() => {
        if (!cancelled) setOwnerPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    isOwner,
    signedIn: Boolean(user),
    isPending: sessionPending || ownerPending,
  };
}
