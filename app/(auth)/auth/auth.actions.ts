"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { addUser, getUser } from "./auth.queries";

interface AccountCredentails {
  email: string;
  password: string;
}

export async function signIn({ email, password }: AccountCredentails) {
  const supabase = await createClient();
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  await addUserIfDoesntExist(email);

  revalidatePath("/", "layout"); // this will revalidate the nextjs cache
  redirect("/");
}

export async function signUp({ email, password }: AccountCredentails) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function addUserIfDoesntExist(email: string) {
  const user = await getUser(email);
  if (!!user) {
    return;
  }

  return await addUser({ email });
}
