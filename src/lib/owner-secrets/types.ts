export const SECRET_X_API_BEARER = "x_api_bearer" as const;

export type OwnerSecretKind = typeof SECRET_X_API_BEARER;

export type OwnerSecretStatus = {
  kind: OwnerSecretKind;
  configured: boolean;
  /** Last 4 characters only — never the full secret */
  last4: string | null;
  updatedAt: string | null;
};
