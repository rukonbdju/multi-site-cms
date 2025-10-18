
import { SidebarProvider } from "@/context/sidebar-context";
import ThemeProvider from "@/context/theme-context";
import AppLayout from "@/layout";
import React from "react";

export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppLayout>{children}</AppLayout>
      </SidebarProvider>
    </ThemeProvider>
  );
}
