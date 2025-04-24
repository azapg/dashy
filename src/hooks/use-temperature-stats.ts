import {TemperatureDataPoint} from "@/experiments/temperature/columns";

import {
  computeAverage, computeRate, computeTrend,
  getLastMinuteData,
  StatPacket,
} from "@/lib/stats";
import {useRef} from "react";

type StatResult = [StatPacket, StatPacket] | [null, StatPacket] | [StatPacket, null] | [null, null];

// TODO: Allow this hook to select a range of statistics, last minute, last hour, last day ...
// TODO: I think the StatPacket thing is quite ugly, a big type with all the necessary data would be nicer.
export function useTemperatureStats(
  data: TemperatureDataPoint[],
): StatResult {
  const lastMinuteData = getLastMinuteData(data);
  const lastStatPackets = useRef<StatResult>([null, null]);
  if (lastMinuteData.length < 2) {
    return [null, null];
  }

  const averageTemperature = computeAverage(lastMinuteData);
  const rate = computeRate(lastMinuteData);

  const lastTemperatureStatPacket = lastStatPackets.current[0];
  const lastAvgTemperature = lastTemperatureStatPacket?.value || 0;
  const lastRateStatPacket = lastStatPackets.current[1];
  const lastRate = lastRateStatPacket?.value || 0;

  const temperatureTrend = computeTrend(averageTemperature, lastAvgTemperature);
  const rateTrend = computeTrend(rate, lastRate);

  const temperatureStat: StatPacket = {
    value: Number(averageTemperature.toFixed(1)),
    trend: temperatureTrend
  }

  const rateStat: StatPacket = {
    value: Number(rate.toFixed(1)),
    trend: rateTrend
  }

  const result: StatResult = [temperatureStat, rateStat];
  lastStatPackets.current = result
  return result;
}