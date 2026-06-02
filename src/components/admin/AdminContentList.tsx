"use client";

import { AdminRowActions, type AdminListResource } from "@/components/admin/AdminRowActions";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ContentSearch } from "@/components/pages/ContentSearch";
import { useMemo, useState } from "react";

export interface AdminListItem {
  id: string;
  title: string;
  slug: string;
  categoryLabel: string;
  status: string;
  updatedAt: string;
}

interface AdminContentListProps {
  items: AdminListItem[];
  columns: string[];
  emptyMessage: string;
  resource: AdminListResource;
}

function matchesSearch(item: AdminListItem, query: string, statusFilter: string): boolean {
  const q = query.trim().toLowerCase();
  if (statusFilter !== "todos" && item.status !== statusFilter) return false;
  if (!q) return true;
  const haystack = [item.title, item.slug, item.categoryLabel, item.status]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function AdminContentList({
  items,
  columns,
  emptyMessage,
  resource,
}: AdminContentListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filtered = useMemo(
    () => items.filter((item) => matchesSearch(item, query, statusFilter)),
    [items, query, statusFilter],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ContentSearch
          value={query}
          onChange={setQuery}
          placeholder="Buscar por título, categoria ou slug…"
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-forest"
          aria-label="Filtrar por status"
        >
          <option value="todos">Todos os status</option>
          <option value="published">Publicado</option>
          <option value="draft">Rascunho</option>
          <option value="archived">Arquivado</option>
        </select>
      </div>
      <p className="text-sm text-muted">
        {filtered.length} de {items.length} registro{items.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-off-white">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/60 hover:bg-sage-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-forest">{item.title}</p>
                    <p className="text-xs text-muted">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{item.categoryLabel}</td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminRowActions resource={resource} item={item} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
