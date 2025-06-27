"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { SideBar } from "../components/SideBar/SideBar";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SidebarProvider>
      <SideBar />
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <main className="flex-1 overflow-auto">{children}</main>
        </QueryClientProvider>
      </UserProvider>
    </SidebarProvider>
  );
}
