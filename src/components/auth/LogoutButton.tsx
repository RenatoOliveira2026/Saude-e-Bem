"use client";

import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";

interface LogoutButtonProps {
  variant?: "ghost" | "outline";
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  label = "Sair",
}: LogoutButtonProps) {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={cn(className)}
      >
        {label}
      </Button>
    </form>
  );
}
