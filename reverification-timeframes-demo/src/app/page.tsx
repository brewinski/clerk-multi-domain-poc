import { auth } from '@clerk/nextjs/server'
import { ReverifyButton } from './reverify-button'

export default async function Home() {
  const { userId, factorVerificationAge } = await auth()

  if (!userId) return <p>Sign in to try the demo.</p>

  const [firstFactorAge, secondFactorAge] = factorVerificationAge ?? [-1, -1]

  return (
    <>
      <h1>Custom reverification timeframes</h1>

      <p>
        Clerk tracks how many minutes ago each factor was verified. <code>-1</code> means
        &ldquo;never&rdquo;.
      </p>
      <ul>
        <li>first factor verified: {firstFactorAge} min ago</li>
        <li>second factor verified: {secondFactorAge} min ago</li>
      </ul>

      <p>
        Each button asks the same server action for the same data, but with a different
        <code> afterMinutes </code> window. Reload the page to see the ages tick up, then
        try the short window again.
      </p>

      <ReverifyButton afterMinutes={1} />
      <ReverifyButton afterMinutes={10} />
      <ReverifyButton afterMinutes={60} />
    </>
  )
}
