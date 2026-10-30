import { emailAndPasswordEnabled } from "./email-password";
import { GROK_PROVIDERS, type GrokProvider } from "./providers";

export class SignInMethodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignInMethodError";
  }
}

/**
 * Sign-in is X, then Google. Email and a site secret are off.
 * Any other provider list, order, or enabled local sign-in fails the check.
 */
export function assertSignInProviders(
  providers: readonly GrokProvider[],
  emailPassword: boolean,
): void {
  if (emailPassword) {
    throw new SignInMethodError("Local email sign-in must stay off");
  }
  const expected: readonly GrokProvider[] = [
    { providerId: "grok-x", idp: "twitter", label: "X" },
    { providerId: "grok-google", idp: "google", label: "Google" },
  ];
  if (providers.length !== expected.length) {
    throw new SignInMethodError("Sign-in offers X and Google only");
  }
  for (let i = 0; i < expected.length; i += 1) {
    const got = providers[i];
    const want = expected[i];
    if (
      !got ||
      got.providerId !== want.providerId ||
      got.idp !== want.idp ||
      got.label !== want.label
    ) {
      throw new SignInMethodError("Sign-in order is X, then Google");
    }
  }
}

/** Reads the live provider list and the local sign-in flag. */
export function checkSignInMethod(): void {
  assertSignInProviders(GROK_PROVIDERS, emailAndPasswordEnabled);
}
