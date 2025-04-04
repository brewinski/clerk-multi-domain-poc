import { SignedIn, SignedOut, SignIn, UserProfile } from "@clerk/nextjs"

export default function ProfilePage() {
  return <div style={{ display: 'flex', justifyContent: 'center' }}>
    <SignedIn>
      <UserProfile
        appearance={{
          elements: {
            cardBox: {
              width: "100vw",
              maxWidth: "100vw",
              borderRadius: "0",
              height: "calc(-80px + 100vh)"
            },
            scrollBox: { borderRadius: "0" },
          }
        }}
      />
    </SignedIn>
    <SignedOut>
      <SignIn />
    </SignedOut>
  </div>
}
