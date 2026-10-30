import { afterEach, describe, expect, it, vi } from "vitest";
import { canopyAdminUserIds, isCanopyAdmin } from "./admin.server";

describe("CANOPY_ADMIN_USER_IDS", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("treats unset, empty, and blank as nobody", () => {
    vi.stubEnv("CANOPY_ADMIN_USER_IDS", "");
    expect(canopyAdminUserIds()).toEqual([]);
    expect(isCanopyAdmin("someone")).toBe(false);

    vi.stubEnv("CANOPY_ADMIN_USER_IDS", "  ,  ");
    expect(canopyAdminUserIds()).toEqual([]);
    expect(isCanopyAdmin("someone")).toBe(false);

    delete process.env.CANOPY_ADMIN_USER_IDS;
    expect(canopyAdminUserIds()).toEqual([]);
    expect(isCanopyAdmin("someone")).toBe(false);
  });

  it("reads one configured id and grants only that account", () => {
    vi.stubEnv("CANOPY_ADMIN_USER_IDS", "  admin-under-test  ");
    expect(canopyAdminUserIds()).toEqual(["admin-under-test"]);
    expect(isCanopyAdmin("admin-under-test")).toBe(true);
    expect(isCanopyAdmin("other-account")).toBe(false);
  });
});
