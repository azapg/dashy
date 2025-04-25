import {TemperatureDataPoint} from "@/experiments/temperature/columns";

import {computeAverage, computeRate, computeTrend, getDataInRange, StatPacket, StatResult,} from "@/lib/stats";
import {useEffect, useRef, useState} from "react";

const INSUFFICIENT_DATA_RESULT: StatResult = {
  temperature: {
    status: 'insufficient-data'
  },
  rate: {
    status: 'insufficient-data'
  }
}

// TODO: Allow this hook to select a range of statistics, last minute, last hour, last day ...
const SNAPSHOT_INTERVAL = 60_000;

export function useTemperatureStats(
  data: TemperatureDataPoint[],
): StatResult {
  const dataRef = useRef<TemperatureDataPoint[]>(data);

  const [averageTemperature, setAverageTemperature] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  const [lastAverageTemperature, setLastAverageTemperature] = useState<number | null>(null);
  const [lastRate, setLastRate] = useState<number | null>(null);

  const computeSnapshotMetrics = (providedData?: TemperatureDataPoint[]) => {
    const effectiveData = providedData ?? dataRef.current;

    const now = Date.now();
    const snapshotData = getDataInRange(effectiveData, {
      start: now - SNAPSHOT_INTERVAL
    })

    if (!lastAverageTemperature || !lastRate) {
      const previousData = getDataInRange(effectiveData, {
        start: now - 2 * SNAPSHOT_INTERVAL,
        end: now - SNAPSHOT_INTERVAL
      })

      const previousAverageTemperature = computeAverage(previousData);
      const previousRate = computeRate(previousData)

      setLastAverageTemperature(previousAverageTemperature)
      setLastRate(previousRate)
    }

    const averageTemperature = computeAverage(snapshotData);
    const rate = computeRate(snapshotData);

    setAverageTemperature(averageTemperature);
    setRate(rate);
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // The use-websocket-data.ts, returns an array with the stored values
    // from the server, once the server connection is established, the current
    // data gets updated with those values, one by one. Then you could calculate
    // the first metrics if the stored values are enough. Normally, the server
    // stores the latest 50 points in a circular buffer.
    //
    // This solution is not the best though, once the server uses its own
    // time series database, it should be restructured to handle data and
    // aggregations more efficiently.
    if(dataRef.current.length < 50 && data.length >= 50) {
      computeSnapshotMetrics(data)
    }

    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const interval = setInterval(computeSnapshotMetrics, SNAPSHOT_INTERVAL)
    return () => clearInterval(interval);
  }, []);

  if (!rate || !averageTemperature) {
    return INSUFFICIENT_DATA_RESULT;
  }

  const temperatureTrend = computeTrend(averageTemperature, lastAverageTemperature ?? 0);
  const rateTrend = computeTrend(rate, lastRate ?? 0);

  const temperatureStat: StatPacket = {
    value: Number(averageTemperature.toFixed(1)),
    trend: temperatureTrend
  }

  const rateStat: StatPacket = {
    value: Number(rate.toFixed(1)),
    trend: rateTrend
  }

  return {
    temperature: {
      status: 'ok',
      stat: temperatureStat
    },
    rate: {
      status: 'ok',
      stat: rateStat
    }
  };
}