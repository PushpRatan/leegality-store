import type { NavigateFunction } from 'react-router-dom'

function getHistoryIndex(): number {
  const state = window.history.state

  if (state && typeof state === 'object' && 'idx' in state && typeof state.idx === 'number') {
    return state.idx
  }

  return 0
}

export function goBackOrHome(navigate: NavigateFunction) {
  if (getHistoryIndex() > 0) {
    navigate(-1)
    return
  }

  navigate('/')
}
