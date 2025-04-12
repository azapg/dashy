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

const temperatures = [
  {
    "ts": 1744408802922,
    "value": "26.5"
  },
  {
    "ts": 1744408800778,
    "value": "29.1"
  },
  {
    "ts": 1744408798636,
    "value": "31.4"
  },
  {
    "ts": 1744408796472,
    "value": "24.9"
  },
  {
    "ts": 1744408794333,
    "value": "33.9"
  },
  {
    "ts": 1744408792170,
    "value": "23.1"
  },
  {
    "ts": 1744408790032,
    "value": "22.2"
  },
  {
    "ts": 1744408787888,
    "value": "29.3"
  },
  {
    "ts": 1744408785718,
    "value": "24.6"
  },
  {
    "ts": 1744408783573,
    "value": "30.1"
  },
  {
    "ts": 1744408781432,
    "value": "24.1"
  },
  {
    "ts": 1744408779293,
    "value": "25.9"
  },
  {
    "ts": 1744408777130,
    "value": "27.7"
  },
  {
    "ts": 1744408774966,
    "value": "20.6"
  },
  {
    "ts": 1744408772827,
    "value": "22.7"
  },
  {
    "ts": 1744408770663,
    "value": "26.5"
  },
  {
    "ts": 1744408768524,
    "value": "20.7"
  },
  {
    "ts": 1744408766385,
    "value": "29.7"
  },
  {
    "ts": 1744408764192,
    "value": "31.7"
  },
  {
    "ts": 1744408762097,
    "value": "30.3"
  },
  {
    "ts": 1744408759902,
    "value": "34.3"
  },
  {
    "ts": 1744408757763,
    "value": "25.6"
  },
  {
    "ts": 1744408755599,
    "value": "28.7"
  },
  {
    "ts": 1744408753461,
    "value": "33.4"
  },
  {
    "ts": 1744408751323,
    "value": "24.7"
  },
  {
    "ts": 1744408749159,
    "value": "21.6"
  },
  {
    "ts": 1744408746995,
    "value": "25.9"
  },
  {
    "ts": 1744408744855,
    "value": "27.7"
  },
  {
    "ts": 1744408742716,
    "value": "34.4"
  },
  {
    "ts": 1744408740545,
    "value": "23.8"
  },
  {
    "ts": 1744408738407,
    "value": "27.2"
  },
  {
    "ts": 1744408736259,
    "value": "30.9"
  },
  {
    "ts": 1744408734112,
    "value": "34.1"
  },
  {
    "ts": 1744408731947,
    "value": "32.2"
  },
  {
    "ts": 1744408729810,
    "value": "29.4"
  },
  {
    "ts": 1744408727647,
    "value": "25.2"
  },
  {
    "ts": 1744408725508,
    "value": "20.0"
  },
  {
    "ts": 1744408723368,
    "value": "34.7"
  },
  {
    "ts": 1744408721204,
    "value": "23.8"
  },
  {
    "ts": 1744408719091,
    "value": "20.1"
  },
  {
    "ts": 1744408716927,
    "value": "30.6"
  },
  {
    "ts": 1744408714761,
    "value": "26.6"
  },
  {
    "ts": 1744408712597,
    "value": "33.6"
  },
  {
    "ts": 1744408710456,
    "value": "27.0"
  },
  {
    "ts": 1744408708318,
    "value": "21.9"
  },
  {
    "ts": 1744408706181,
    "value": "27.1"
  },
  {
    "ts": 1744408704018,
    "value": "29.2"
  },
  {
    "ts": 1744408701851,
    "value": "31.3"
  },
  {
    "ts": 1744408699686,
    "value": "32.4"
  },
  {
    "ts": 1744408697573,
    "value": "26.5"
  },
  {
    "ts": 1744408695409,
    "value": "30.3"
  },
  {
    "ts": 1744408693245,
    "value": "23.7"
  },
  {
    "ts": 1744408691112,
    "value": "32.3"
  },
  {
    "ts": 1744408688984,
    "value": "34.3"
  },
  {
    "ts": 1744408686794,
    "value": "27.9"
  },
  {
    "ts": 1744408684654,
    "value": "33.4"
  },
  {
    "ts": 1744408682491,
    "value": "25.2"
  },
  {
    "ts": 1744408680351,
    "value": "21.0"
  },
  {
    "ts": 1744408678188,
    "value": "34.2"
  },
  {
    "ts": 1744408676051,
    "value": "28.4"
  },
  {
    "ts": 1744408673889,
    "value": "26.6"
  },
  {
    "ts": 1744408671750,
    "value": "23.0"
  },
  {
    "ts": 1744408669610,
    "value": "33.1"
  },
  {
    "ts": 1744408667463,
    "value": "22.2"
  },
  {
    "ts": 1744408665317,
    "value": "21.9"
  },
  {
    "ts": 1744408663152,
    "value": "34.3"
  },
  {
    "ts": 1744408660990,
    "value": "21.8"
  },
  {
    "ts": 1744408658849,
    "value": "31.1"
  },
  {
    "ts": 1744408656709,
    "value": "30.1"
  },
  {
    "ts": 1744408654545,
    "value": "28.1"
  },
  {
    "ts": 1744408652405,
    "value": "25.5"
  },
  {
    "ts": 1744408650265,
    "value": "28.1"
  },
  {
    "ts": 1744408648098,
    "value": "25.6"
  },
  {
    "ts": 1744408645978,
    "value": "33.5"
  },
  {
    "ts": 1744408643805,
    "value": "33.2"
  },
  {
    "ts": 1744408641649,
    "value": "22.0"
  },
  {
    "ts": 1744408639534,
    "value": "26.9"
  },
  {
    "ts": 1744408637319,
    "value": "25.3"
  },
  {
    "ts": 1744408635182,
    "value": "31.2"
  },
  {
    "ts": 1744408633015,
    "value": "27.6"
  },
  {
    "ts": 1744408630875,
    "value": "34.1"
  },
  {
    "ts": 1744408628687,
    "value": "22.9"
  },
  {
    "ts": 1744408626498,
    "value": "29.9"
  },
  {
    "ts": 1744408624357,
    "value": "32.7"
  },
  {
    "ts": 1744408622183,
    "value": "34.5"
  },
  {
    "ts": 1744408620049,
    "value": "28.8"
  },
  {
    "ts": 1744408617890,
    "value": "28.6"
  },
  {
    "ts": 1744408615726,
    "value": "31.6"
  },
  {
    "ts": 1744408613610,
    "value": "34.4"
  },
  {
    "ts": 1744408611445,
    "value": "34.6"
  },
  {
    "ts": 1744408609282,
    "value": "21.7"
  },
  {
    "ts": 1744408607143,
    "value": "31.5"
  },
  {
    "ts": 1744408604980,
    "value": "23.6"
  },
  {
    "ts": 1744408602843,
    "value": "26.5"
  },
  {
    "ts": 1744408600680,
    "value": "28.2"
  },
  {
    "ts": 1744408598539,
    "value": "27.8"
  },
  {
    "ts": 1744408596385,
    "value": "32.4"
  },
  {
    "ts": 1744408594242,
    "value": "27.9"
  },
  {
    "ts": 1744408592078,
    "value": "31.5"
  },
  {
    "ts": 1744408589937,
    "value": "31.6"
  }
].map(
  point => {
    return {
      timestamp: Number(point.ts),
      value: point.value,
      device: "sensor #1"
    };
  }
)

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
