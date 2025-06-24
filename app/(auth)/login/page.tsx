"use client";

import TabSelect from "@/app/components/TabSelect/TabSelect";
import { useState } from "react";
import { signIn, signUp } from "./actions";
import { Stethoscope } from "lucide-react";
import { EmailConfirmCard } from "@/app/components/EmailConfirmCard/EmailConfirmCard";

export default function LoginPage() {
  const [selectedOption, setSelectedOption] = useState<string>("Sign in");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showConfirmEmail, setShowConfirmEmail] = useState<boolean>(false);

  const welcomeSubText =
    selectedOption == "Sign in"
      ? "Sign in to your account to continue"
      : "Sign up to create a new account";

  const handleClick = async () => {
    if (selectedOption === "Sign in") {
      await signIn({ email, password });
    } else {
      const successful = await signUp({ email, password });
      if (successful) {
        setShowConfirmEmail(true);
      } else {
        console.log("Error");
      }
    }
  };

  const handleBackToLogin = () => {
    setShowConfirmEmail(false);
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      {showConfirmEmail ? (
        <EmailConfirmCard onBackToLogin={handleBackToLogin} />
      ) : (
        <>
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                MedInvoice
              </h1>
              <p className="text-slate-600">
                Simple billing & insights for private clinics
              </p>
            </div>
          </div>
          <div className="w-[440] h-[440] shadow-2xl rounded-xl bg-white flex flex-col justify-center gap-[20px] p-8">
            <div className="flex flex-col gap-[2px]">
              <h4 className="text-black text-2xl font-bold">Welcome!</h4>
              <h1 className="text-slate-600">{welcomeSubText}</h1>
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
              <p className="text-white">{selectedOption}</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
