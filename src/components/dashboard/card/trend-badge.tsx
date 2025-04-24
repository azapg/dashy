import {IconTrendingDown, IconTrendingUp, IconArrowNarrowRight} from "@tabler/icons-react";
import {Badge} from "@/components/ui/badge";
import {Trend} from "@/lib/stats";

interface TrendBadgeProps {
  trend?: Trend
}

export function TrendBadge({trend}: TrendBadgeProps) {
  let icon;

  if(!trend) {
    return <></>;
  }

  switch (trend.direction) {
    case "down": icon = <IconTrendingDown />; break
    case "up": icon = <IconTrendingUp />; break
    default: icon = <IconArrowNarrowRight />; break
  }

  return (
    <Badge variant="outline">
      {icon}
      <span className="trend">{trend.percentage}{trend?.percentage ? '%' : '0%'}</span>
    </Badge>
  )
}