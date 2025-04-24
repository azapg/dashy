import {TemperatureDataPoint} from "@/experiments/temperature/columns";

import {
  computeAverage, computeRate, computeTrend,
  getLastMinuteData,
  StatPacket, StatResult,
} from "@/lib/stats";
import {useRef} from "react";

const INSUFFICIENT_DATA_RESULT: StatResult = {
  temperature: {
    status: 'insufficient-data'
  },
  rate: {
    status: 'insufficient-data'
  }
}

// TODO: Allow this hook to select a range of statistics, last minute, last hour, last day ...
export function useTemperatureStats(
  data: TemperatureDataPoint[],
): StatResult {
  const lastMinuteData = getLastMinuteData(data);
  const lastResult = useRef<StatResult>(INSUFFICIENT_DATA_RESULT);

  if (lastMinuteData.length < 2) {
    return INSUFFICIENT_DATA_RESULT;
  }

  const averageTemperature = computeAverage(lastMinuteData);
  const rate = computeRate(lastMinuteData);

  const lastTemperatureStatPacket = lastResult.current.temperature.stat;
  const lastAvgTemperature = lastTemperatureStatPacket?.value || 0;
  const lastRateStatPacket = lastResult.current.rate.stat;
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

  const result: StatResult = {
    temperature: {
      status: 'ok',
      stat: temperatureStat
    },
    rate: {
      status: 'ok',
      stat: rateStat
    }
  }

  lastResult.current = result
  return result;
}