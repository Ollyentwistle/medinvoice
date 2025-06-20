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
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
