import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { ChartAreaInteractive } from "@/components/dashboard/chart/chart-area-interactive"
import { DataTable } from "@/components/dashboard/table/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import React from "react";
import {temperatureColumns, TemperatureDataPoint} from "@/experiments/temperature/columns";

import data from '@/../public/data.json'

const temperatures: TemperatureDataPoint[] = data.temperature.map(point => {
  return {
    timestamp: point.ts,
    value: point.value,
    device: "Arduino MKR WiFi 1010",
  } as unknown as TemperatureDataPoint;
})

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <DataTable columns={temperatureColumns} data={temperatures} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}