const test = require("node:test");
const assert = require("node:assert/strict");
const nextConfig = require("../next.config");
const { CONTENT_SECURITY_POLICY } = require("../src/lib/security");

test("all routes receive restrictive security headers", async () => {
  const rules = await nextConfig.headers();
  assert.equal(rules.length, 1);
  assert.equal(rules[0].source, "/:path*");
  assert.ok(
    rules[0].headers.some(
      (header) => header.key === "Content-Security-Policy" && header.value === CONTENT_SECURITY_POLICY,
    ),
  );
  assert.ok(
    rules[0].headers.some(
      (header) => header.key === "X-Content-Type-Options" && header.value === "nosniff",
    ),
  );
});

test("CSP has no broad wildcard or unsafe eval source", () => {
  assert.match(CONTENT_SECURITY_POLICY, /default-src 'self'/);
  assert.match(CONTENT_SECURITY_POLICY, /frame-ancestors 'none'/);
  assert.match(CONTENT_SECURITY_POLICY, /object-src 'none'/);
  assert.doesNotMatch(CONTENT_SECURITY_POLICY, /(?:^|\s)\*(?:\s|;|$)/);
  assert.doesNotMatch(CONTENT_SECURITY_POLICY, /'unsafe-eval'/);
});
