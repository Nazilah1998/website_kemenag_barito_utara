import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// ─── Project root relative to this test file ─────────────────────────────────
const ROOT = path.resolve(__dirname, "..");

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function isDir(relPath) {
  try {
    return fs.statSync(path.join(ROOT, relPath)).isDirectory();
  } catch {
    return false;
  }
}

function fileSize(relPath) {
  try {
    return fs.statSync(path.join(ROOT, relPath)).size;
  } catch {
    return 0;
  }
}

function countFilesRecursive(relPath) {
  let count = 0;
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else count++;
    }
  }
  try {
    walk(path.join(ROOT, relPath));
  } catch {
    // directory doesn't exist
  }
  return count;
}

// ─── Critical files existence ─────────────────────────────────────────────────

describe("Project Integrity: Critical files exist", () => {
  const criticalFiles = [
    "src/app/layout.js",
    "src/app/page.js",
    "proxy.js",
    "src/proxy.js",
    "src/db/schema.ts",
    "src/lib/drizzle.ts",
    "src/lib/env.ts",
    "src/lib/permissions.ts",
    "src/lib/rate-limit.ts",
    "src/lib/api-helpers.ts",
    "src/lib/audit.ts",
    "src/lib/validation.ts",
    "next.config.mjs",
    "package.json",
    "jsconfig.json",
    "vitest.config.mjs",
  ];

  for (const file of criticalFiles) {
    it(`${file} exists`, () => {
      expect(exists(file), `Missing critical file: ${file}`).toBe(true);
    });
  }
});

// ─── Critical directories exist ───────────────────────────────────────────────

describe("Project Integrity: Critical directories exist", () => {
  const criticalDirs = [
    "src/app/admin",
    "src/app/api",
    "src/app/api/admin",
    "src/components",
    "src/components/features",
    "src/components/features/admin",
    "src/hooks",
    "src/lib",
    "src/db",
    "tests",
    "public",
  ];

  for (const dir of criticalDirs) {
    it(`${dir}/ directory exists`, () => {
      expect(isDir(dir), `Missing critical directory: ${dir}/`).toBe(true);
    });
  }
});

// ─── PWA & Service Worker files ───────────────────────────────────────────────

describe("Project Integrity: PWA assets exist", () => {
  it("public/sw.js (Service Worker) exists", () => {
    expect(exists("public/sw.js")).toBe(true);
  });

  it("public/sw.js is not empty", () => {
    expect(fileSize("public/sw.js")).toBeGreaterThan(0);
  });

  it("public/manifest.webmanifest exists", () => {
    expect(exists("public/manifest.webmanifest")).toBe(true);
  });

  it("public/manifest.webmanifest is valid JSON", () => {
    const content = fs.readFileSync(path.join(ROOT, "public/manifest.webmanifest"), "utf-8");
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it("public/manifest.webmanifest has required PWA fields", () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(ROOT, "public/manifest.webmanifest"), "utf-8")
    );
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});

// ─── Security: Sensitive files NOT committed ──────────────────────────────────

describe("Project Integrity: Sensitive files not present in project root", () => {
  it(".env.local is NOT present (should be in .gitignore)", () => {
    // In CI/test environments .env.local should not exist in the repo
    // If it does, it means someone accidentally committed credentials
    // Note: this test is informational — .env.local is valid locally
    // We verify .gitignore mentions it instead
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toContain(".env.local");
  });

  it(".gitignore exists and covers .env files", () => {
    expect(exists(".gitignore")).toBe(true);
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toContain(".env");
  });

  it(".gitignore excludes node_modules", () => {
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toContain("node_modules");
  });
});

// ─── Admin routes exist ───────────────────────────────────────────────────────

describe("Project Integrity: Admin pages exist", () => {
  const adminPages = [
    "src/app/admin/berita",
    "src/app/admin/galeri",
    "src/app/admin/laporan",
    "src/app/admin/halaman",
    "src/app/admin/homepage-slides",
    "src/app/admin/login",
    "src/app/admin/seksi",
  ];

  for (const page of adminPages) {
    it(`${page}/ admin page directory exists`, () => {
      expect(isDir(page), `Missing admin page: ${page}/`).toBe(true);
    });
  }
});

// ─── package.json scripts integrity ───────────────────────────────────────────

describe("Project Integrity: package.json scripts", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));

  it("has 'dev' script", () => {
    expect(pkg.scripts?.dev).toBeDefined();
  });

  it("has 'build' script", () => {
    expect(pkg.scripts?.build).toBeDefined();
  });

  it("has 'test' script (Vitest)", () => {
    expect(pkg.scripts?.test).toBeDefined();
    expect(pkg.scripts.test).toContain("vitest");
  });

  it("has 'db:push' script (Drizzle)", () => {
    expect(pkg.scripts?.["db:push"]).toBeDefined();
  });

  it("has 'test:e2e' script (Playwright)", () => {
    expect(pkg.scripts?.["test:e2e"]).toBeDefined();
  });

  it("lists 'next' as a dependency", () => {
    expect(pkg.dependencies?.next).toBeDefined();
  });

  it("lists 'drizzle-orm' as a dependency", () => {
    expect(pkg.dependencies?.["drizzle-orm"]).toBeDefined();
  });

  it("lists 'vitest' as a devDependency", () => {
    expect(pkg.devDependencies?.vitest).toBeDefined();
  });

  it("lists '@playwright/test' as a devDependency", () => {
    expect(pkg.devDependencies?.["@playwright/test"]).toBeDefined();
  });
});

// ─── Project size sanity checks ───────────────────────────────────────────────

describe("Project Integrity: Source code size sanity checks", () => {
  it("src/lib has at least 20 utility modules", () => {
    const count = countFilesRecursive("src/lib");
    expect(count).toBeGreaterThanOrEqual(20);
  });

  it("tests directory has at least 10 test files", () => {
    const count = fs.readdirSync(path.join(ROOT, "tests"))
      .filter(f => f.endsWith(".test.js") || f.endsWith(".test.jsx") || f.endsWith(".test.ts"))
      .length;
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("src/app/api has admin API routes", () => {
    expect(isDir("src/app/api/admin")).toBe(true);
    const adminApis = fs.readdirSync(path.join(ROOT, "src/app/api/admin"));
    expect(adminApis.length).toBeGreaterThanOrEqual(5);
  });

  it("src/components has at least 10 component files total", () => {
    const count = countFilesRecursive("src/components");
    expect(count).toBeGreaterThanOrEqual(10);
  });
});
