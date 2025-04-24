import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {TrendBadge} from "@/components/dashboard/card/trend-badge";
import {Trend} from "@/lib/stats";

type StatCardData = {
  legend: string;
  value?: number | null;
  unit?: string | null;
  trend?: Trend | null
}

export function StatCard({legend, value, trend, unit}: StatCardData) {
  if(!value || !trend) {
    return <></>
  }

  return <Card className="@container/card">
    <CardHeader>
      <CardDescription>{legend}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {value} {unit ?? <></>}
      </CardTitle>
      <CardAction>
        <TrendBadge trend={trend}/>
      </CardAction>
    </CardHeader>
  </Card>;
}