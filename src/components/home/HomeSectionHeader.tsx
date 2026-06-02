import { Button } from "@/components/ui/Button";
import {
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { cn } from "@/lib/cn";

interface HomeSectionHeaderProps {
  label: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
}

export function HomeSectionHeader({
  label,
  title,
  description,
  actionLabel,
  actionHref,
  align = "left",
  className,
  dark = false,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <SectionHeader align={align} className="mb-0 md:max-w-2xl">
        <SectionLabel className={dark ? "text-gold/90" : undefined}>{label}</SectionLabel>
        <SectionTitle className={dark ? "text-off-white" : undefined}>{title}</SectionTitle>
        <SectionDescription
          className={cn(
            align === "left" ? "text-left" : "text-center mx-auto",
            dark && "text-off-white/75",
          )}
        >
          {description}
        </SectionDescription>
      </SectionHeader>
      {actionLabel && actionHref && (
        <Button
          href={actionHref}
          variant={dark ? "gold" : "outline"}
          className="shrink-0 self-start md:self-auto"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
