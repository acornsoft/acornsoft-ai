import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SignInActions } from "@/components/site/sign-in-actions";
import { emailAndPasswordEnabled } from "./email-password";
import { GROK_PROVIDERS, type GrokProvider } from "./providers";
import {
  SignInMethodError,
  assertSignInProviders,
  checkSignInMethod,
} from "./signin-method";

describe("sign-in method", () => {
  it("exits cleanly when the providers are X then Google and local sign-in is off", () => {
    expect(emailAndPasswordEnabled).toBe(false);
    expect(() => checkSignInMethod()).not.toThrow();
    expect(GROK_PROVIDERS.map((provider) => provider.label)).toEqual(["X", "Google"]);
  });

  it("fails when a third provider is added", () => {
    const withThird: GrokProvider[] = [
      ...GROK_PROVIDERS,
      { providerId: "grok-extra", idp: "extra", label: "Extra" },
    ];
    expect(() => assertSignInProviders(withThird, false)).toThrow(SignInMethodError);
  });

  it("fails when local email sign-in is enabled", () => {
    expect(() => assertSignInProviders(GROK_PROVIDERS, true)).toThrow(SignInMethodError);
  });

  it("fails when Google is listed before X", () => {
    const swapped = [...GROK_PROVIDERS].reverse();
    expect(() => assertSignInProviders(swapped, false)).toThrow(SignInMethodError);
  });

  it("fails when the list is empty, only one provider, or the upstream id is wrong", () => {
    expect(() => assertSignInProviders([], false)).toThrow(SignInMethodError);
    expect(() => assertSignInProviders([GROK_PROVIDERS[0]], false)).toThrow(SignInMethodError);
    expect(() =>
      assertSignInProviders(
        [
          { providerId: "grok-x", idp: "google", label: "X" },
          { providerId: "grok-google", idp: "twitter", label: "Google" },
        ],
        false,
      ),
    ).toThrow(SignInMethodError);
  });

  it("fails when email sign-in is on even if a third provider is also present", () => {
    const withThird: GrokProvider[] = [
      ...GROK_PROVIDERS,
      { providerId: "grok-extra", idp: "extra", label: "Extra" },
    ];
    expect(() => assertSignInProviders(withThird, true)).toThrow(SignInMethodError);
  });

  it("renders X before Google on the sign-in screen", () => {
    const html = renderToStaticMarkup(
      createElement(
        SignInActions,
        {
          providers: GROK_PROVIDERS,
          busy: null,
          previewSignIn: false,
          onSignIn: () => undefined,
        },
        createElement("p", null, "How access works"),
      ),
    );
    const x = html.indexOf("Continue with X");
    const gate = html.indexOf("How access works");
    const google = html.indexOf("Continue with Google");
    expect(x).toBeGreaterThanOrEqual(0);
    expect(gate).toBeGreaterThan(x);
    expect(google).toBeGreaterThan(gate);
    expect(html.indexOf('data-provider-id="grok-x"')).toBeLessThan(
      html.indexOf('data-provider-id="grok-google"'),
    );
    expect(html.toLowerCase()).not.toMatch(/password/);
  });

  it("the sign-in page source does not offer a password field", () => {
    const login = readFileSync(join(process.cwd(), "src/routes/login.tsx"), "utf8");
    const actions = readFileSync(
      join(process.cwd(), "src/components/site/sign-in-actions.tsx"),
      "utf8",
    );
    expect(login.toLowerCase()).not.toMatch(/password/);
    expect(actions.toLowerCase()).not.toMatch(/password/);
  });
});
