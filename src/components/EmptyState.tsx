type EmptyStateProps = {
  message: string
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center"
      role="status"
    >
      <p className="text-slate-600">{message}</p>
    </div>
  )
}

export default EmptyState
