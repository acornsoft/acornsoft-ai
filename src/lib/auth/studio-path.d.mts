export function studioPath(): string;
export function isSafeAppPath(value: string): boolean;
export function isLoginReturnPath(value: string): boolean;
export function isLegacyStudioPath(value: string | undefined): boolean;
export function redirectNamesStudio(value: string | undefined): boolean;
export function destinationForSignIn(input: {
  next?: string;
  redirect?: string;
}): string;
export function authOffAllowsOwner(): boolean;
