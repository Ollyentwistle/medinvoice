"use client";
import { signOut } from "@/app/(auth)/login/actions";

export default function Dashboard() {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      Dashboard
    </div>
  );
}
