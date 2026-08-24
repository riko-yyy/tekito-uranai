import { useEffect, useState } from 'react'
import type { ActionsDB } from '../data/types'

interface State {
  data: ActionsDB | null
  loading: boolean
  error: string | null
}

export function useActionsData(): State {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    fetch('/data/teki_uranai_actions.json')
      .then((res) => {
        if (!res.ok) throw new Error(`failed to load actions db: ${res.status}`)
        return res.json() as Promise<ActionsDB>
      })
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          setState({ data: null, loading: false, error: message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
