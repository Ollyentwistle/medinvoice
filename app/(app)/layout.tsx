import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { SideBar } from "../components/SideBar/SideBar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SideBar />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  );
}
