'use client';

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { ChartTimeseriesInteractive } from "@/components/dashboard/chart/chart-timeseries-interactive"
import { DataTable } from "@/components/dashboard/table/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import React, {useEffect} from "react";
import {temperatureColumns, TemperatureDataPoint} from "@/experiments/temperature/columns";

function useDynamicPlaceholderData(addFn: () => TemperatureDataPoint, interval = 1000) {
  const [data, setData] = React.useState<TemperatureDataPoint[]>([])

  useEffect(() => {
    const executeAndUpdate = () => {
      const newPoint = addFn()
      setData(prevPoints => [...prevPoints, newPoint])
    }

    executeAndUpdate()
    const id = setInterval(executeAndUpdate, interval)

    return () => clearInterval(id)
  }, [interval]);

  return data
}


const useWebSocketData = () => {
  const [data, setData] = React.useState<TemperatureDataPoint[]>([])
  const DASHY_SERVER_URL = process.env.NEXT_PUBLIC_DASHY_SERVER_URL;

  if(!DASHY_SERVER_URL) {
    throw new Error("No DASHY_SERVER_URL provided");
  }

  useEffect(() => {
    const ws = new WebSocket(DASHY_SERVER_URL);
    ws.onopen = () => { console.log('Connected to Dashy server') }
    ws.onclose = () => { console.log('Disconnected from Dashy server') }

    ws.onmessage = (event: MessageEvent) => {
      setData(data => [...data, JSON.parse(event.data)])
    }

    return () => { ws.close() }
  }, [DASHY_SERVER_URL])

  return data;
}
export default function Page() {

  // const temperatures = useDynamicPlaceholderData((): TemperatureDataPoint => {
  //   const randomTemperature = Math.random() * (28 - 19) + 19;
  //   return {
  //     timestamp: new Date().getTime(),
  //     value: Number(randomTemperature.toFixed(1)),
  //     device: "Cheap Sensor"
  //   }
  // })

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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
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