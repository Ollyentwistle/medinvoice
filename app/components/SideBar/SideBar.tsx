"use client";
import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChartSpline,
  UserRound,
  Layers,
  CreditCard,
  Stethoscope,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartSpline,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: UserRound,
  },
  {
    title: "Services",
    url: "/services",
    icon: Layers,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
];

export function SideBar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">MedInvoice</h2>
            <p className="text-xs text-slate-500">Clinic Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
