'use server'

import { auth, reverificationError } from '@clerk/nextjs/server'
import type { ReverificationConfig } from '@clerk/nextjs/types'

/**
 * The whole point of this demo.
 *
 * `ReverificationConfig` is either one of Clerk's four presets —
 *
 *   strict_mfa -> { level: 'multi_factor',  afterMinutes: 10   }
 *   strict     -> { level: 'second_factor', afterMinutes: 10   }
 *   moderate   -> { level: 'second_factor', afterMinutes: 60   }
 *   lax        -> { level: 'second_factor', afterMinutes: 1440 }
 *
 * — or an object you build yourself, which is how you get an arbitrary
 * timeframe. `afterMinutes` must be >= 1 and < 99,999.
 */
export async function readSensitiveData(afterMinutes: number) {
  const { has } = await auth.protect()

  const config: ReverificationConfig = {
    level: 'second_factor',
    afterMinutes,
  }

  // `has()` compares `afterMinutes` against the session's factor verification
  // ages (the `fva` claim). Stale -> hand the client a reverification hint
  // instead of the data.
  if (!has({ reverification: config })) {
    return reverificationError(config)
  }

  return { creditScore: 700, readAt: new Date().toISOString() }
}
