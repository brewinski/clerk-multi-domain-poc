'use client'

import { useState } from 'react'
import { useReverification } from '@clerk/nextjs'
import { isReverificationCancelledError } from '@clerk/nextjs/errors'
import { readSensitiveData } from './actions'

export function ReverifyButton({ afterMinutes }: { afterMinutes: number }) {
  const [result, setResult] = useState('')

  // `useReverification` wraps the action: if it comes back with a
  // reverification hint, Clerk opens its modal and then retries the action.
  const read = useReverification(readSensitiveData)

  async function handleClick() {
    setResult('…')
    try {
      const data = await read(afterMinutes)
      setResult(JSON.stringify(data))
    } catch (error) {
      setResult(
        isReverificationCancelledError(error) ? 'cancelled' : `error: ${String(error)}`,
      )
    }
  }

  return (
    <p>
      <button onClick={handleClick}>Read with a {afterMinutes} minute window</button>{' '}
      <code>{result}</code>
    </p>
  )
}
