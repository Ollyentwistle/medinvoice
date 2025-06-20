"use client";
import { useUser } from "@/hooks/useUser";
import { signOut } from "./auth/login/actions";

export default function Home() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      {user ? (
        <div className="flex justify-center items-center flex-col">
          <p>Welcome, {user.email}</p>
          <button
            className="w-64 bg-blue-600 h-[36px] rounded-md mt-[12px]"
            onClick={handleSignOut}
          >
            <p className="text-white">Sign out</p>
          </button>
        </div>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
}
