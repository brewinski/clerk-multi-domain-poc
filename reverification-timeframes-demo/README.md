# Custom reverification timeframes with Clerk

A minimal Next.js app showing how to require reverification on your **own** time
window instead of one of Clerk's four presets.

Four files carry the whole idea: `src/app/actions.ts`, `src/app/reverify-button.tsx`,
`src/app/page.tsx`, and `src/proxy.ts`.

## The idea

Clerk's session token carries an `fva` ("factor verification age") claim — how many
whole minutes ago each factor was last verified, where `-1` means "never". Every
reverification check is a comparison against that number.

A `ReverificationConfig` is either one of the presets:

| Preset       | level           | afterMinutes |
| ------------ | --------------- | ------------ |
| `strict_mfa` | `multi_factor`  | 10           |
| `strict`     | `second_factor` | 10           |
| `moderate`   | `second_factor` | 60           |
| `lax`        | `second_factor` | 1440         |

...or an object you build yourself, which is how you get an arbitrary window:

```ts
{ level: 'second_factor', afterMinutes: 3 }
```

`afterMinutes` must be `>= 1` and `< 99999`. That object goes everywhere a preset
string goes — `has()`, `auth.protect()`, `reverificationError()`, `<Show when={...}>`.

## How the flow fits together

```
client                                server
──────                                ──────
read(afterMinutes)  ──────────────▶   auth.protect()
                                      has({ reverification: { level, afterMinutes } })
                                        │
                    ◀─────────────────  └─ stale → reverificationError(config)
useReverification sees the hint,
opens Clerk's modal at config.level
       │
       └─ user verifies ───────────▶   retried automatically → data
```

`reverificationError(config)` returns a plain object, not a thrown error:

```json
{
  "clerk_error": {
    "type": "forbidden",
    "reason": "reverification-error",
    "metadata": { "reverification": { "level": "second_factor", "afterMinutes": 3 } }
  }
}
```

`useReverification()` recognises that shape in the action's **return value**, opens the
modal, and then calls the action again. So the server action must `return` the error —
returning anything else (or throwing) skips the modal entirely.

## Running it

No Clerk account needed — the CLI provisions throwaway development keys:

```sh
npm install
npx clerk@latest init --accountless   # writes dev keys into .env.local
npm run dev                           # http://localhost:3003
```

Sign in, then click the buttons. The page prints the live factor ages, so you can watch
them tick up on reload and see the 1-minute window start re-prompting while the
60-minute one still passes.

> **Keyless mode changed in Clerk Core 3.** On `@clerk/nextjs@6`, starting the dev server
> with no keys auto-provisioned an instance and logged a "You are running in keyless mode"
> banner with a claim URL. On v7 that no longer happens — booting without keys throws
> `Clerk keys are missing from your environment` and points you at `clerk init`. The keys
> now land in `.env.local` rather than a `.clerk/` directory. Run
> `npx clerk@latest auth login` later to claim the app and keep the same keys.
>
> Treat a claim URL as a credential: anyone holding it can claim the instance.

If you already have a Clerk app, skip the CLI and copy your keys from
[the dashboard](https://dashboard.clerk.com) into `.env.local` instead — see
`.env.example`.

`clerk init` also scaffolds `src/app/sign-in/` and `src/app/sign-up/` routes. They aren't
part of the reverification idea; they just give the demo somewhere to sign in.

## Things worth knowing

- **Only `level` reaches the client.** The modal is driven by `config.level`;
  `afterMinutes` is evaluated server-side by `has()` and never changes what the user
  sees. The modal is the same for `afterMinutes: 2` and `afterMinutes: 2000`.
- **The comparison is strict**: `afterMinutes > factorAge`. Ages are whole minutes, so
  `afterMinutes: 1` is satisfied only while the factor age is still `0`.
- **Don't go too short.** A window of 1–2 minutes will re-prompt constantly, and because
  the retry happens immediately after verification the user can end up in a loop if the
  action is slow. Treat ~5 minutes as a practical floor.
- **`second_factor` silently falls back to the first factor** when the user has no MFA
  enrolled (`factorAge[1] === -1`). If you genuinely need two factors, use
  `level: 'multi_factor'`, which fails outright for users without MFA.
- **Cancellation throws.** If the user dismisses the modal, the wrapped call rejects with
  a Clerk runtime error — check it with `isReverificationCancelledError()` from
  `@clerk/nextjs/errors`.
- `auth.protect()` only guarantees a signed-in user here; it does not check the
  timeframe. The `has()` call does that.

## Verified against

| Package         | Version  |
| --------------- | -------- |
| `@clerk/nextjs` | 7.9.20   |
| `next`          | 16.4.3   |
| `react`         | 19.3.1   |

Clerk Core 3 (`@clerk/nextjs@7`) removed `<SignedIn>`, `<SignedOut>` and `<Protect>` in
favour of `<Show when={...}>`, which this demo uses. The reverification APIs themselves
(`useReverification`, `reverificationError`, `has({ reverification })`) were unchanged by
that major.
