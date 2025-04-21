'use client';

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import React from "react";
import {SiteHeader} from "@/components/dashboard/site-header";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader heading={"Grupo Einsteins"} />
        <div className={"w-full h-full flex items-center justify-center"}>
          <p>Seleccione un experimento para visualizar</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}