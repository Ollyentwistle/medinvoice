"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { SideBar } from "../components/SideBar/SideBar";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SidebarProvider>
      <SideBar />
      <QueryClientProvider client={queryClient}>
        <main className="flex-1 overflow-auto">{children}</main>
      </QueryClientProvider>
    </SidebarProvider>
  );
}
