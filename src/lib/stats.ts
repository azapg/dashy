import {TemperatureDataPoint} from "@/experiments/temperature/columns";

export type TrendDirection = 'up' | 'down' | 'stable';
export type Trend = {
  percentage: number;
  direction: TrendDirection;
}

export type StatPacket = {
  value?: number | null;
  trend?: Trend | null;
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

export function getTrendDirection(percentage: number): TrendDirection {
  if(percentage < 0) {
    return 'down'
  } else if(percentage == 0) {
    return 'stable'
  }

  return 'up'
}