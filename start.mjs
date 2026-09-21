import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const paths = [
  ".output/server/index.mjs",
  "../.output/server/index.mjs",
  "../../.output/server/index.mjs",
];

const found = paths.find((p) => existsSync(p));

if (found) {
  execSync(`node ${found}`, { stdio: "inherit" });
} else {
  console.error("Could not find .output/server/index.mjs");
  process.exit(1);
}
