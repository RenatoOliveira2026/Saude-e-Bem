interface CmsFeaturedSwitchProps {
  defaultChecked?: boolean;
  label?: string;
}

export function CmsFeaturedSwitch({
  defaultChecked,
  label = "Conteúdo em destaque",
}: CmsFeaturedSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gold/30 bg-gold-muted/30 px-4 py-3">
      <input
        type="checkbox"
        name="featured"
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-border text-gold focus:ring-gold/30"
      />
      <span className="text-sm font-medium text-forest">
        <span aria-hidden="true">⭐ </span>
        {label}
      </span>
    </label>
  );
}
