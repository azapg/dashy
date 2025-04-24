import {TrendBadge} from "@/components/dashboard/card/trend-badge";
import {Trend} from "@/lib/stats";
import {DataCard} from "@/components/dashboard/card/data-card";

type StatCardData = {
  legend: string;
  value: number;
  unit?: string;
  trend: Trend
}

export function StatCard({legend, value, trend, unit}: StatCardData) {
  let title = String(value);

  if(unit) {
    title = title + " " + unit;
  }

  return <DataCard description={legend} title={title} action={<TrendBadge trend={trend}/>} />
}