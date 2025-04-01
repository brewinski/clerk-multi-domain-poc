import { SignedIn, SignedOut, SignIn, UserProfile } from "@clerk/nextjs";

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <SignedIn>
        <UserProfile />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  );
}
