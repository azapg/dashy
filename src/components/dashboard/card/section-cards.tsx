import {StatCard} from "@/components/dashboard/card/stat-card";
import {StatResult} from "@/lib/stats";
import {DataCard} from "@/components/dashboard/card/data-card";
import {ActionableCard} from "@/components/dashboard/card/actionable-card";

interface SectionCardsProps {
  stats: StatResult
}

// TODO: make this very dynamic to make easy new stat "widgets"
export function SectionCards({stats}: SectionCardsProps) {
  function TemperatureStatCard() {
    const stat = stats.temperature.stat;
    const description = "Temperatura Promedio";
    if(stats.temperature.status == 'insufficient-data' || stat == null) {
      return <DataCard description={description} title={"Datos Insuficientes"} action={<></>} />
    }

    return <StatCard
      legend={description}
      value={stat.value}
      unit={"°C"}
      trend={stat.trend}
    />;
  }

  function RateStatCard() {
    const stat = stats.rate.stat;
    const description = "Datos por minuto";
    if(stats.rate.status == 'insufficient-data' || stat == null) {
    }

    return <StatCard
      legend={description}
      value={stat.value}
      trend={stat.trend}
    />;
  }

  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <ActionableCard description={"Controlador de LED"}/>
      {TemperatureStatCard()}
      {RateStatCard()}
    </div>
  )
}
