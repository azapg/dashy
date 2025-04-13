"use client"

import * as React from "react"
import {Line, LineChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {useIsMobile} from "@/hooks/use-mobile"
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

import {TemperatureDataPoint} from "@/experiments/temperature/columns";
import {formatDate} from "@/lib/date";

const chartConfig = {
  temperature: {
    label: "Temperatura",
    color: "var(--secondary)",
  }
} satisfies ChartConfig


interface ChartAreaInteractiveProps {
  data: TemperatureDataPoint[]
}


// TODO: For now, this chart should only show the last minute data just like
//  ThingsBoard's charts. The x-axis would always update by one second, so one
//  second appears on the right and one disappears on the left, and every five
//  seconds, a tick must be drawn. Also, the x-axis should behave like this even
//  when there is no data to display.
export function ChartAreaInteractive({data}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("automático")

  const filteredData = data.filter((item) => {
    const date = new Date(item.timestamp)
    const now = new Date();

    return date.getSeconds() < now.getSeconds() + 10;
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
            <ToggleGroupItem value="auto">Automático</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months"/>
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
              <SelectItem value="auto" className="rounded-lg">
                Automático
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      {/* chart */}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            data={data}
          >
           <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              domain={['auto', 'auto']}
              interval={"equidistantPreserveStart"}
              name="Tiempo"
              type={"number"}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return formatDate(date)
              }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={"temperature"}
                />
              }
            />
            <Line
              dataKey={"value"}
              type={"linear"}
              stroke={"blue"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
