import {StatCard} from "@/components/dashboard/card/stat-card";
import {StatPacket} from "@/lib/stats";

interface SectionCardsProps {
  rate: StatPacket,
  temperature: StatPacket
}

// TODO: make this very dynamic to make easy new stat "widgets"
export function SectionCards({rate, temperature}: SectionCardsProps) {

  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard legend={"Temperatura Promedio"} value={temperature.value} unit={"°C"} trend={{
        percentage: temperature.trend.percentage,
        direction: temperature.trend.direction
      }}/>
      <StatCard legend={"Datos por minuto"} value={rate.value} trend={{
        percentage: rate.trend.percentage,
        direction: rate.trend.direction,
      }}/>
    </div>
  )
}
