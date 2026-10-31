import type { ReactNode } from 'react'

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightText(text: string, query: string): ReactNode {
  const trimmed = query.trim()

  if (!trimmed) {
    return text
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'gi'))

  return parts.map((part, index) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded-sm bg-amber-200 text-slate-900">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}