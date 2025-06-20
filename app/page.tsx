"use client";
import { signOut } from "./auth/login/actions";

export default function Home() {
  const handleSignOut = async () => {
    await signOut();
  };

  const user = {
    email: "mock email",
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <p>Welcome, {user.email}</p>
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
