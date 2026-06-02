interface AdminTableProps {
  columns: string[];
  children: React.ReactNode;
}

export function AdminTable({ columns, children }: AdminTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-sage-muted/30">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-forest"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm text-graphite ${className ?? ""}`}>
      {children}
    </td>
  );
}

export function AdminTableActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminTableCell>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </AdminTableCell>
  );
}
