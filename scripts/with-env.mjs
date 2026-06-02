import nextEnv from "@next/env";
import { spawn } from "node:child_process";

const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const nextCommand = process.argv[2] ?? "dev";

/**
 * Em alguns ambientes Windows (antivírus/proxy), chamadas HTTPS ao Supabase
 * falham com UNABLE_TO_VERIFY_LEAF_SIGNATURE. Em dev, relaxamos a verificação TLS
 * do Node para restaurar cadastro/login local. Desative com SUPABASE_STRICT_TLS=1.
 */
if (
  nextCommand === "dev" &&
  process.env.SUPABASE_STRICT_TLS !== "1" &&
  process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0"
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn(
    "[with-env] TLS relaxado em dev (Supabase Auth). Defina SUPABASE_STRICT_TLS=1 para desativar.",
  );
}

const nextArgs = ["next", nextCommand];

const child = spawn("npx", nextArgs, {
  stdio: "inherit",
  env: process.env,
  shell: true,
  cwd: projectDir,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
