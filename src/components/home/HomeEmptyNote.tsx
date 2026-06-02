interface HomeEmptyNoteProps {
  message: string;
}

export function HomeEmptyNote({ message }: HomeEmptyNoteProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
      <p className="text-sm leading-relaxed text-muted">{message}</p>
    </div>
  );
}
