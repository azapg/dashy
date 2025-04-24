import {TemperatureDataPoint} from "@/experiments/temperature/columns";

export type TrendDirection = 'up' | 'down' | 'stable';
export type Trend = {
  percentage: number;
  direction: TrendDirection;
}

export type StatStatus = 'ok' | 'insufficient-data';

export type StatPacket = {
  value: number;
  trend: Trend;
}

export type StatResult = {
  temperature: {
    status: StatStatus;
    stat?: StatPacket;
  },
  rate: {
    status: StatStatus;
    stat?: StatPacket;
  }
}

export type Range = {
  start: number,
  end: number
}

export function getLastMinuteData(data: TemperatureDataPoint[]): TemperatureDataPoint[] {
  const now = Date.now();
  const lastMinute = now - 60 * 1000;
  return data.filter(point => point.timestamp > lastMinute);
}

export function computeAverage(data: TemperatureDataPoint[]): number {
  return data.reduce((sum, point) => sum + point.value, 0) / data.length;
}

export function computeRate(data: TemperatureDataPoint[]): number {
  let accumulatedSpans = 0;

  for(let i = 1; i < data.length; i++) {
    const previousDataPoint = data[i - 1];
    const currentDataPoint = data[i];

    const span = currentDataPoint.timestamp - previousDataPoint.timestamp;
    accumulatedSpans += span;
  }

  return data.length / (accumulatedSpans / 60_000);
}

export function computeTrend(current: number, previous: number): Trend {
  if (previous === 0) {
    return {
      percentage: 0,
      direction: 'stable'
    };
  }

  const raw = ((current - previous) / previous) * 100;
  const direction = raw === 0 ? 'stable' : raw > 0 ? 'up' : 'down';

  return {
    percentage: Number(raw.toFixed(2)),
    direction
  };
}