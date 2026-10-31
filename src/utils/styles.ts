export function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export const outlineButtonClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40'

export const primaryButtonClass =
  'rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'

export const dangerButtonClass =
  'rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800'

export const fieldClass =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'

export const panelClass =
  'h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24'

export function radioOptionClass(selected: boolean): string {
  return cx(
    'w-full rounded-md px-3 py-2 text-left text-sm',
    selected
      ? 'bg-indigo-50 font-medium text-indigo-700'
      : 'text-slate-700 hover:bg-slate-50',
  )
}
