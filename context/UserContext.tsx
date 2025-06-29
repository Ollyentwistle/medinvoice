"use client";

import { getUser } from "@/app/(auth)/auth/auth.queries";
import { User, UserBase } from "@/models/users";
import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<{ user: User | null }>({ user: null });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const email = session?.user.email;

      if (!email) return;

      const appUser = await getUser(email);

      setUser({
        email: appUser.email,
        role: appUser.role,
      });
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
