import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const workflowPath = join(process.cwd(), ".github", "workflows", "auto-release.yml");

describe("auto-release workflow", () => {
  test("creates a semver tag and GitHub Release from package.json after main receives a new version", () => {
    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("name: Auto Release From Main");
    expect(workflow).toContain("branches:");
    expect(workflow).toContain("- main");
    expect(workflow).toContain("contents: write");
    expect(workflow).toContain("fetch-depth: 0");
    expect(workflow).toContain("PACKAGE_VERSION=");
    expect(workflow).toContain('TAG_NAME="v${PACKAGE_VERSION}"');
    expect(workflow).toContain("refs/tags/${TAG_NAME}");
    expect(workflow).toContain("already exists. Skipping release.");
    expect(workflow).toContain('git tag -a "${TAG_NAME}"');
    expect(workflow).toContain('git push origin "${TAG_NAME}"');
    expect(workflow).toContain('gh release create "${TAG_NAME}"');
    expect(workflow).toContain("--generate-notes");
    expect(workflow).toContain("--verify-tag");
  });
});
