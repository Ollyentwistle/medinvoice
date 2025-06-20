"use client";
import { signOut } from "@/app/(auth)/login/actions";

export default function Dashboard() {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex justify-center items-center flex-col">
        {/* <p>Welcome, {user.email}</p> */}
        <button
          className="w-64 bg-blue-600 h-[36px] rounded-md mt-[12px]"
          onClick={handleSignOut}
        >
          <p className="text-white">Sign out</p>
        </button>
      </div>
    </div>
  );
}
