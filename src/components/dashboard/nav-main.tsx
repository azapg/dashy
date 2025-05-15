"use client"

import {IconCirclePlusFilled, IconTemperatureCelsius, IconDroplets} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {useAuth} from "@/context/auth-provider";


const CreateExperimentButton = () => (
  <SidebarMenu>
    <SidebarMenuItem className="flex items-center gap-2">
      <SidebarMenuButton
        tooltip="Quick Create"
        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
      >
        <IconCirclePlusFilled/>
        <span>Crear nuevo experimento</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

interface NavMainProps {
  selected?: number | undefined
}

export function NavMain({selected}: NavMainProps) {
  const { isAdmin } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paneles</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        {isAdmin ? <CreateExperimentButton/> : null}
        <SidebarMenu>
          <SidebarMenuItem key="Experimento Temperatura" className={`${selected == 1 ? 'bg-accent' : ''} rounded-md`}>
            <Link href="/dashboard/temperatura">
              <SidebarMenuButton tooltip="Experimento Temperatura">
                <IconTemperatureCelsius/>
                <span>Experimento Temperatura</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem key="Experimento Humedad" className="rounded-md opacity-50">
            <SidebarMenuButton tooltip="Experimento Humedad">
              <IconDroplets/>
              <span>Experimento Humedad</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
