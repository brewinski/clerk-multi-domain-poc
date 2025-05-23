"use client"
import { SignedIn, SignedOut, SignIn, UserProfile } from "@clerk/nextjs"
import Image from "next/image"

const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}

const CustomPageContent = () => {
  return (<>
    <a href="https://canstarblue-ideal-alignment-production.up.railway.app/energy">
      <Image
        src="/dashboard-example-pt1.png"
        sizes="100vw"
        alt="test"
        quality={90}
        fill
        priority // Important for LCP (Largest Contentful Paint) optimization
        style={{
          objectFit: 'contain',
          objectPosition: 'left',
          zIndex: 0, // Place below content
          minWidth: "100%",
          background: "#f8f8f8"
        }}
      />
    </a>
  </>)
}

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
      >
        <UserProfile.Page
          label="Dashboard"
          url="dashboard"
          labelIcon={<DotIcon />}
        >
          <CustomPageContent />
        </UserProfile.Page>

        <UserProfile.Page label="account" />

        <UserProfile.Page
          label="Delete"
          url="delete"
          labelIcon={<DotIcon />}
        >
          <button className="bg-red hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">delete my account</button>
        </UserProfile.Page>

        <UserProfile.Page
          label="Credit Score"
          url="credit-score"
          labelIcon={<DotIcon />}
        >
          <p>This Is My Credit Score!</p>
        </UserProfile.Page>

        <UserProfile.Page label="security" />
      </UserProfile>


    </SignedIn>
    <SignedOut>
      <SignIn />
    </SignedOut>
  </div>
}
