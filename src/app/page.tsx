'use client';

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import React from "react";
import {SiteHeader} from "@/components/dashboard/site-header";
import {useAppState} from "@/context/app-state-provider";
import {ExperimentDashboard} from "@/components/dashboard/experiment-dashboard";

export default function Page() {
  const { currentExperiment } = useAppState();

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
        <SiteHeader heading={currentExperiment?.title ?? ""} />
        { currentExperiment ? (
          <ExperimentDashboard />
        ) : (
          <div className={"w-full h-full flex items-center justify-center"}>
            <p>Seleccione un experimento para visualizar</p>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}