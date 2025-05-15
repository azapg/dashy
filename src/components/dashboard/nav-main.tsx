"use client"

import {IconPlus} from "@tabler/icons-react"

import {
  SidebarGroup, SidebarGroupAction,
  SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useAuth} from "@/context/auth-provider";
import {Skeleton} from "@/components/ui/skeleton";
import {DynamicIcon} from "lucide-react/dynamic";
import {useAppState} from "@/context/app-state-provider";
import {useEffect, useState} from "react";
import {Experiment, getExperiments} from "@/api/experiments";
import { toast } from "sonner";

interface ExperimentItemProps {
  experiment: Experiment;
  isSelected: boolean;
  onClick: () => void
}

const ExperimentItem = ({experiment, isSelected, onClick}: ExperimentItemProps) => (
  <SidebarMenu>
    <SidebarMenuItem key="Experimento Temperatura" className={`${isSelected ? 'bg-accent' : ''} rounded-md`}>
      <SidebarMenuButton tooltip={experiment.title} onClick={() => onClick()}>
        <DynamicIcon name={experiment.icon_name as never}/>
        <span>{experiment.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

export function NavMain() {
  const {isAdmin} = useAuth();
  const {currentExperiment, setCurrentExperiment} = useAppState();

  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiments = async () => {
      const response = await getExperiments();

      if(response.success && response.data) {
        setExperiments(response.data.experiments)
      } else {
        toast.error("No se encontraron experimentos en la base de datos. Por favor contacte a un administrador.");
      }
    }

    fetchExperiments().then(() => setLoading(false));
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paneles</SidebarGroupLabel>
      {isAdmin ? (
        <SidebarGroupAction title="Crear experimento">
          <IconPlus/> <span className="sr-only">Crear experimento</span>
        </SidebarGroupAction>
      ) : null}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {loading ? (
            <>
              {Array(3).fill(<Skeleton className="h-7"/>)}
            </>
          ) : (
            experiments.map(experiment => (
              <ExperimentItem
                key={experiment.experiment_id}
                experiment={experiment}
                isSelected={currentExperiment?.experiment_id === experiment.experiment_id}
                onClick={() => setCurrentExperiment(experiment)}
              />
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
