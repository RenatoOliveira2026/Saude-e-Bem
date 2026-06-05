import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import type { SourceConversionMetric } from "@/lib/crm/types";

interface SourceMetricsTableProps {
  metrics: SourceConversionMetric[];
}

export function SourceMetricsTable({ metrics }: SourceMetricsTableProps) {
  if (metrics.length === 0) {
    return (
      <p className="text-sm text-muted">Nenhuma captura registrada por origem.</p>
    );
  }

  return (
    <AdminTable
      columns={["Origem", "Total", "Quentes", "Taxa quente", "7 dias", "30 dias"]}
    >
      {metrics.map((row) => (
        <tr key={row.source} className="hover:bg-sage-muted/20">
          <AdminTableCell>
            <span className="font-medium text-forest">{row.label}</span>
          </AdminTableCell>
          <AdminTableCell>{row.total}</AdminTableCell>
          <AdminTableCell>{row.hotCount}</AdminTableCell>
          <AdminTableCell>{row.hotRate}%</AdminTableCell>
          <AdminTableCell>{row.last7Days}</AdminTableCell>
          <AdminTableCell>{row.last30Days}</AdminTableCell>
        </tr>
      ))}
    </AdminTable>
  );
}
