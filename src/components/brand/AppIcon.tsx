import { brandColors } from "./logo-config";
import { LogoMark } from "./LogoMark";

interface AppIconProps {
  size?: number;
  className?: string;
}

/**
 * App Icon oficial — símbolo sobre fundo Off White.
 * Usado em apple-icon, PWA manifest e telas de instalação.
 */
export function AppIcon({ size = 180, className }: AppIconProps) {
  const markSize = Math.round(size * 0.68);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brandColors.offWhite,
        borderRadius: Math.round(size * 0.2),
      }}
    >
      <LogoMark size={markSize} variant="dark" title="Saúde & Bem" />
    </div>
  );
}
