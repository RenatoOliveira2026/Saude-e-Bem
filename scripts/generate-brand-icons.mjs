/**
 * Gera favicon.ico e ícones PWA (Windows: PowerShell + System.Drawing).
 * Uso: npm run generate:brand-icons
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const psScript = join(root, "scripts", "generate-brand-icons.ps1");
const logoPath = join(root, "public", "logo-saude-bem.png");

if (!existsSync(logoPath)) {
  console.error(`Logo não encontrado: ${logoPath}`);
  process.exit(1);
}

const result = spawnSync(
  "powershell",
  ["-ExecutionPolicy", "Bypass", "-File", psScript],
  { stdio: "inherit", cwd: root },
);

process.exit(result.status ?? 1);
