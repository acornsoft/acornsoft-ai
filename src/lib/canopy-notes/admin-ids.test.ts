import { afterEach, describe, expect, it, vi } from "vitest";
import { parseCanopyAdminUserIds } from "./admin-ids";
import { canopyAdminUserIds, isCanopyAdmin } from "./admin.server";

describe("parseCanopyAdminUserIds", () => {
  it("treats missing, empty, and blank input as no admins", () => {
    expect(parseCanopyAdminUserIds(undefined)).toEqual([]);
    expect(parseCanopyAdminUserIds(null)).toEqual([]);
    expect(parseCanopyAdminUserIds("")).toEqual([]);
    expect(parseCanopyAdminUserIds("   ")).toEqual([]);
    expect(parseCanopyAdminUserIds(",")).toEqual([]);
    expect(parseCanopyAdminUserIds(",,")).toEqual([]);
    expect(parseCanopyAdminUserIds(" , , ")).toEqual([]);
  });

  it("trims segments, drops empty ones, and does not split on spaces", () => {
    expect(parseCanopyAdminUserIds("  only-one  ")).toEqual(["only-one"]);
    expect(parseCanopyAdminUserIds(" alpha , beta , , gamma ")).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
    expect(parseCanopyAdminUserIds("alpha beta")).toEqual(["alpha beta"]);
  });

  it("returns only the ids in the string and no built-in default", () => {
    expect(parseCanopyAdminUserIds("from-env")).toEqual(["from-env"]);
    expect(parseCanopyAdminUserIds("from-env")).toHaveLength(1);
    expect(parseCanopyAdminUserIds(undefined)).toEqual([]);
  });
});

describe("CANOPY_ADMIN_USER_IDS", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads the environment and grants nobody when it is unset, empty, or blank", () => {
    vi.stubEnv("CANOPY_ADMIN_USER_IDS", "");
    expect(canopyAdminUserIds()).toEqual([]);
    expect(isCanopyAdmin("someone")).toBe(false);
    expect(isCanopyAdmin("")).toBe(false);

    vi.stubEnv("CANOPY_ADMIN_USER_IDS", "  ,  ");
    expect(canopyAdminUserIds()).toEqual([]);
    expect(isCanopyAdmin("someone")).toBe(false);

    delete process.env.CANOPY_ADMIN_USER_IDS;
    expect(canopyAdminUserIds()).toEqual([]);
    expect(isCanopyAdmin("someone")).toBe(false);
  });

  it("matches whole ids only, after trim, including a comma-separated list", () => {
    vi.stubEnv("CANOPY_ADMIN_USER_IDS", "  alpha , beta  ");
    expect(canopyAdminUserIds()).toEqual(["alpha", "beta"]);
    expect(isCanopyAdmin("alpha")).toBe(true);
    expect(isCanopyAdmin("beta")).toBe(true);
    expect(isCanopyAdmin("alph")).toBe(false);
    expect(isCanopyAdmin("alpha beta")).toBe(false);
    expect(isCanopyAdmin("gamma")).toBe(false);
  });
});
