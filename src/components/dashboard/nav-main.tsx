"use client"

import {IconCirclePlusFilled, IconTemperatureCelsius, IconDroplets} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminView = false;

const CreateExperimentButton = () => (
  <SidebarMenu>
    <SidebarMenuItem className="flex items-center gap-2">
      <SidebarMenuButton
        tooltip="Quick Create"
        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
      >
        <IconCirclePlusFilled />
        <span>Crear nuevo experimento</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paneles</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        { adminView ? <CreateExperimentButton /> : null }
        <SidebarMenu>
          <SidebarMenuItem key="Experimento Temperatura" className="bg-accent rounded-md">
            <SidebarMenuButton tooltip="Experimento Temperatura">
              <IconTemperatureCelsius />
              <span>Experimento Temperatura</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="Experimento Humedad" className="rounded-md opacity-50">
            <SidebarMenuButton tooltip="Experimento Humedad">
              <IconDroplets />
              <span>Experimento Humedad</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
