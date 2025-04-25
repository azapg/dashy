import {IconTrendingDown, IconTrendingUp, IconArrowNarrowRight} from "@tabler/icons-react";
import {Badge} from "@/components/ui/badge";
import {Trend} from "@/lib/stats";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Image from "next/image";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline">
            {icon}
            <span className="trend">{trend.percentage}{trend?.percentage ? '%' : '0%'}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <Image
            src="/trend_eq.svg"
            alt="Ecuación utilizada para el cálculo de la tendencia"
            width={200}
            height={75}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}