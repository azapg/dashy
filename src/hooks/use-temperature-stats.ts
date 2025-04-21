import {TemperatureDataPoint} from "@/experiments/temperature/columns";

import {
  getLastMinuteData, getTrendDirection,
  StatPacket,
} from "@/lib/stats";
import {useMemo, useRef} from "react";

type StatResult = [StatPacket, StatPacket] | [null, StatPacket] | [StatPacket, null] | [null, null];

// TODO: Allow this hook to select a range of statistics, last minute, last hour, last day ...
// TODO: I think the StatPacket thing is quite ugly, a big type with all the necessary data would be nicer.
export function useTemperatureStats(
  data: TemperatureDataPoint[],
): StatResult {
  const lastMinuteData = getLastMinuteData(data);
  const lastStatPackets = useRef<StatResult>([null, null]);

  const averageTemperature = useMemo(() => {
    let temperatures = 0;
    lastMinuteData.forEach((point) => {
      temperatures += Number(point.value);
    })

    return (temperatures / (lastMinuteData.length ?? 1));
  }, [lastMinuteData]);


  if (lastMinuteData.length < 2) {
    return [null, null];
  }

  let accumulatedSpans = 0;

  for(let i = 1; i < lastMinuteData.length; i++) {
    const previousDataPoint = lastMinuteData[i - 1];
    const currentDataPoint = lastMinuteData[i];

    const span = (currentDataPoint.timestamp - previousDataPoint.timestamp) / 1000;
    accumulatedSpans += span;
  }

  const rate = accumulatedSpans / lastMinuteData.length;

  const lastTemperatureStatPacket = lastStatPackets.current[0];
  const lastAvgTemperature = lastTemperatureStatPacket?.value || 0;
  const lastRateStatPacket = lastStatPackets.current[1];
  const lastRate = lastRateStatPacket?.value || 0;

  const relativeRateDifference = rate - lastRate / (rate ?? 1);
  const relativeThermalDifference = averageTemperature - lastAvgTemperature / (averageTemperature ?? 1);

  const direction = getTrendDirection(relativeThermalDifference);

  const temperatureStat: StatPacket = {
    value: Number(averageTemperature.toFixed(1)),
    trend: {
      percentage: Number((relativeThermalDifference * 100).toFixed(1)),
      direction
    }
  }

  const rateStat: StatPacket = {
    value: Number(rate.toFixed(1)),
    trend: {
      percentage: Number((relativeRateDifference * 100).toFixed(1)),
      direction: getTrendDirection(relativeThermalDifference)
    }
  }

  const result: StatResult = [temperatureStat, rateStat];
  lastStatPackets.current = result
  return result;
}