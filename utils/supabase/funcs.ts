import { createClient } from "./client";

const supabase = createClient();

export async function fetchUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
