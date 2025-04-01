import { UserProfile } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <UserProfile />
    </div>
  );
}
