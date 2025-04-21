'use client';

import React from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { ChartTimeseriesInteractive } from "@/components/dashboard/chart/chart-timeseries-interactive"
import { DataTable } from "@/components/dashboard/table/data-table"
import { SiteHeader } from "@/components/dashboard/site-header"
import {temperatureColumns} from "@/experiments/temperature/columns";
import {useWebSocketData} from "@/hooks/use-websocket-data";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function Page() {
  const temperatures = useWebSocketData();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" selected={1}/>
      <SidebarInset>
        <SiteHeader heading={"Experimento Temperatura"} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ChartTimeseriesInteractive data={temperatures}/>
              </div>
              <div className="px-4 lg:px-6">
                <DataTable columns={temperatureColumns} data={temperatures.toReversed()} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}