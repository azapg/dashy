"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {parseTimeRange} from "@/lib/parse";

export const description = "Un gráfico de área interactivo"

const chartData = [
  {
    "ts": 1744405818761,
    "value": "34.8"
  },
  {
    "ts": 1744405816598,
    "value": "34.0"
  },
  {
    "ts": 1744405814460,
    "value": "31.3"
  },
  {
    "ts": 1744405812315,
    "value": "24.5"
  },
  {
    "ts": 1744405810145,
    "value": "26.7"
  },
  {
    "ts": 1744405808002,
    "value": "20.2"
  },
  {
    "ts": 1744405805874,
    "value": "28.6"
  },
  {
    "ts": 1744405803717,
    "value": "25.7"
  },
  {
    "ts": 1744405801577,
    "value": "34.9"
  },
  {
    "ts": 1744405799427,
    "value": "29.5"
  },
  {
    "ts": 1744405797282,
    "value": "24.3"
  },
  {
    "ts": 1744405795088,
    "value": "25.4"
  },
  {
    "ts": 1744405792945,
    "value": "26.7"
  },
  {
    "ts": 1744405790805,
    "value": "28.2"
  },
  {
    "ts": 1744405788662,
    "value": "33.8"
  },
  {
    "ts": 1744405786521,
    "value": "24.7"
  },
  {
    "ts": 1744405784355,
    "value": "24.2"
  },
  {
    "ts": 1744405782191,
    "value": "26.6"
  },
  {
    "ts": 1744405780175,
    "value": "22.8"
  },
  {
    "ts": 1744405777907,
    "value": "32.5"
  },
  {
    "ts": 1744405775765,
    "value": "30.3"
  },
  {
    "ts": 1744405773618,
    "value": "32.1"
  },
  {
    "ts": 1744405771442,
    "value": "29.5"
  },
  {
    "ts": 1744405769322,
    "value": "22.4"
  },
  {
    "ts": 1744405767081,
    "value": "20.2"
  },
  {
    "ts": 1744405764914,
    "value": "21.7"
  },
  {
    "ts": 1744405762747,
    "value": "22.2"
  },
  {
    "ts": 1744405760605,
    "value": "30.1"
  },
  {
    "ts": 1744405758439,
    "value": "30.9"
  },
  {
    "ts": 1744405756298,
    "value": "30.1"
  },
  {
    "ts": 1744405754158,
    "value": "28.1"
  },
  {
    "ts": 1744405751918,
    "value": "24.8"
  },
  {
    "ts": 1744405749661,
    "value": "27.5"
  },
  {
    "ts": 1744405747461,
    "value": "26.9"
  },
  {
    "ts": 1744405745341,
    "value": "31.0"
  },
  {
    "ts": 1744405743300,
    "value": "26.4"
  },
  {
    "ts": 1744405741047,
    "value": "20.4"
  },
  {
    "ts": 1744405738906,
    "value": "32.0"
  },
  {
    "ts": 1744405736741,
    "value": "24.8"
  },
  {
    "ts": 1744405734574,
    "value": "27.7"
  },
  {
    "ts": 1744405732335,
    "value": "23.0"
  },
  {
    "ts": 1744405730171,
    "value": "25.4"
  },
  {
    "ts": 1744405728033,
    "value": "22.8"
  },
  {
    "ts": 1744405725892,
    "value": "30.3"
  },
  {
    "ts": 1744405723644,
    "value": "27.0"
  },
  {
    "ts": 1744405721475,
    "value": "25.6"
  },
  {
    "ts": 1744405719336,
    "value": "20.7"
  },
  {
    "ts": 1744405717172,
    "value": "27.1"
  },
  {
    "ts": 1744405714956,
    "value": "27.8"
  },
  {
    "ts": 1744405712765,
    "value": "21.9"
  },
  {
    "ts": 1744405710624,
    "value": "24.6"
  },
  {
    "ts": 1744405708485,
    "value": "31.6"
  },
  {
    "ts": 1744405706322,
    "value": "26.7"
  },
  {
    "ts": 1744405704207,
    "value": "26.0"
  },
  {
    "ts": 1744405702032,
    "value": "28.3"
  },
  {
    "ts": 1744405699893,
    "value": "25.7"
  },
  {
    "ts": 1744405697725,
    "value": "26.7"
  },
  {
    "ts": 1744405695559,
    "value": "26.3"
  },
  {
    "ts": 1744405693442,
    "value": "33.2"
  },
  {
    "ts": 1744405691276,
    "value": "33.6"
  },
  {
    "ts": 1744405689109,
    "value": "28.2"
  },
  {
    "ts": 1744405686869,
    "value": "30.3"
  },
  {
    "ts": 1744405684702,
    "value": "21.5"
  },
  {
    "ts": 1744405682561,
    "value": "25.2"
  },
  {
    "ts": 1744405680417,
    "value": "22.9"
  },
  {
    "ts": 1744405678265,
    "value": "20.4"
  },
  {
    "ts": 1744405676017,
    "value": "25.7"
  },
  {
    "ts": 1744405673881,
    "value": "30.9"
  },
  {
    "ts": 1744405671701,
    "value": "23.6"
  },
  {
    "ts": 1744405669558,
    "value": "20.4"
  },
  {
    "ts": 1744405667421,
    "value": "23.0"
  },
  {
    "ts": 1744405665258,
    "value": "23.0"
  },
  {
    "ts": 1744405663120,
    "value": "33.1"
  },
  {
    "ts": 1744405660981,
    "value": "29.4"
  },
  {
    "ts": 1744405658817,
    "value": "26.6"
  },
  {
    "ts": 1744405656680,
    "value": "32.0"
  },
  {
    "ts": 1744405654512,
    "value": "30.5"
  },
  {
    "ts": 1744405652361,
    "value": "26.1"
  },
  {
    "ts": 1744405650218,
    "value": "20.2"
  },
  {
    "ts": 1744405648055,
    "value": "32.8"
  },
  {
    "ts": 1744405645919,
    "value": "30.4"
  },
  {
    "ts": 1744405643783,
    "value": "34.9"
  },
  {
    "ts": 1744405641621,
    "value": "22.6"
  },
  {
    "ts": 1744405639458,
    "value": "27.7"
  },
  {
    "ts": 1744405637320,
    "value": "32.6"
  },
  {
    "ts": 1744405635158,
    "value": "26.7"
  },
  {
    "ts": 1744405633022,
    "value": "20.5"
  },
  {
    "ts": 1744405630859,
    "value": "31.7"
  },
  {
    "ts": 1744405628710,
    "value": "23.3"
  },
  {
    "ts": 1744405626570,
    "value": "30.3"
  },
  {
    "ts": 1744405624408,
    "value": "20.3"
  },
  {
    "ts": 1744405622269,
    "value": "24.5"
  },
  {
    "ts": 1744405620106,
    "value": "32.2"
  },
  {
    "ts": 1744405617968,
    "value": "21.2"
  },
  {
    "ts": 1744405615931,
    "value": "29.5"
  },
  {
    "ts": 1744405613542,
    "value": "32.6"
  },
  {
    "ts": 1744405611404,
    "value": "27.3"
  },
  {
    "ts": 1744405609240,
    "value": "23.7"
  },
  {
    "ts": 1744405607097,
    "value": "30.5"
  },
  {
    "ts": 1744405604846,
    "value": "31.7"
  }
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("automático")

  // TODO: new data is not filtered. This is designed to display days in the x axis
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.ts)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const parsedRange = parseTimeRange(timeRange);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Temperatura</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Temperatura en el rango {parsedRange}
          </span>
          <span className="@[540px]/card:hidden">En el rango {parsedRange}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
            <ToggleGroupItem value="1d">Últimas 24 horas</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 días
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 días
              </SelectItem>
              <SelectItem value="1d" className="rounded-lg">
                Últimas 24 horas
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ts"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
