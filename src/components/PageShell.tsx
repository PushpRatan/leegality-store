import type { ReactNode } from 'react'
import { cx } from '../utils/styles'

type PageShellProps = {
  children: ReactNode
  size?: 'wide' | 'narrow'
}

function PageShell({ children, size = 'wide' }: PageShellProps) {
  return (
    <main>
      <div
        className={cx('mx-auto p-4 md:p-8', size === 'wide' ? 'max-w-7xl' : 'max-w-5xl')}
      >
        {children}
      </div>
    </main>
  )
}

export default PageShell
