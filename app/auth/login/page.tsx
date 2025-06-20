"use client";

import TabSelect from "@/app/componentsMe/TabSelect/TabSelect";
import { useState, useTransition } from "react";
import { signIn, signUp } from "./actions";

export default function LoginPage() {
  const [selectedOption, setSelectedOption] = useState<string>("Sign in");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const welcomeSubText =
    selectedOption == "Sign in"
      ? "Sign in to your account to continue"
      : "Sign up to create a new account";

  const handleClick = () => {
    startTransition(() => {
      if (selectedOption === "Sign in") {
        signIn({ email, password });
      } else {
        signUp({ email, password });
      }
    });
  };

  return (
    <div className="flex h-screen justify-center items-center  ">
      <div className="w-[440] h-[440] shadow-2xl rounded-xl bg-white flex flex-col justify-center gap-[20px] p-8">
        <div className="flex flex-col gap-[2px]">
          <h4 className="text-black text-2xl font-bold">Welcome!</h4>
          <h1 className="text-gray-400">{welcomeSubText}</h1>
        </div>
        <TabSelect
          options={["Sign in", "Sign up"]}
          selectedOption={selectedOption}
          setSelected={setSelectedOption}
        />
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-black ">Email</h1>
          <input
            className="w-full h-[32px] border-[1px] border-solid border-gray-400 rounded-sm text-black"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-black">Password</h1>
          <input
            className="w-full h-[32px] border-[1px] border-solid border-gray-400 rounded-sm text-black"
            onChange={(e) => setPassword(e.currentTarget.value)}
            type="password"
          />
        </div>
        <button
          className="w-full bg-blue-600 h-[36px] rounded-md mt-[12px]"
          onClick={handleClick}
        >
          <p className="text-white">
            {isPending ? "Signing in..." : "Sign In"}
          </p>
        </button>
      </div>
    </div>
  );
}
