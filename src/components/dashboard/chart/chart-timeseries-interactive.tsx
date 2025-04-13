"use client"

import * as React from "react"
import {Line, LineChart, CartesianGrid, XAxis, YAxis} from "recharts"

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
import {useEffect} from "react";

const chartConfig = {
  temperature: {
    label: "Temperatura",
    color: "var(--secondary)",
  }
} satisfies ChartConfig


interface ChartAreaInteractiveProps {
  data: TemperatureDataPoint[]
}

const useDynamicAxisData = (): [number, number, number[]] => {
  const [min, setMin] = React.useState(0)
  const [max, setMax] = React.useState(0)
  const [ticks, setTicks] = React.useState<number[]>([])

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const currentSeconds = now.getSeconds();
      const secondsRemainder = currentSeconds % 5;
      const mostRecentFiveSecMark = new Date(now);
      mostRecentFiveSecMark.setMilliseconds(0);
      mostRecentFiveSecMark.setSeconds(currentSeconds - secondsRemainder);

      const timestamps = [];
      for (let i = 0; i < 12; i++) {
        const tickTime = new Date(mostRecentFiveSecMark);
        tickTime.setSeconds(mostRecentFiveSecMark.getSeconds() - (i * 5));
        timestamps.push(tickTime.getTime());
      }

      timestamps.reverse();

      setMin(timestamps[0]);
      setMax(timestamps[timestamps.length - 1]);
      setTicks(timestamps);
    }

    update()

    const id = setInterval(() => update(), 1000)
    return () => clearInterval(id)
  }, []);

  return [min, max, ticks]
}

// TODO: recharts sucks, use an alternative
export function ChartTimeseriesInteractive({data}: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("timeseries")
  const [min, max, ticks] = useDynamicAxisData();

  console.log(ticks)

  const parsedRange = parseTimeRange(timeRange);

  const filteredData = data.filter(point => {
    return point.timestamp >= min - 1000;
  })

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
            <ToggleGroupItem value="30d" disabled>Últimos 30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d" disabled>Últimos 7 días</ToggleGroupItem>
            <ToggleGroupItem value="1d" disabled>Últimas 24 horas</ToggleGroupItem>
            <ToggleGroupItem value="timeseries">Time series</ToggleGroupItem>
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
              <SelectItem value="timeseries" className="rounded-lg">
                Time series
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
            data={filteredData}
          >
           <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              domain={[min, max]}
              name="Tiempo"
              type={"number"}
              ticks={ticks}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return formatDate(date)
              }}
            />
            <YAxis domain={['auto', 'auto']}/>
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
