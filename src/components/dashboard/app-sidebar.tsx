"use client"

import * as React from "react"
import {
  IconDatabase,
  IconBrain,
  IconReport,
  IconSettings,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/dashboard/nav-documents"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Allan Zapata",
    email: "allan@einsteins.team",
    avatar: "https://cdn.discordapp.com/emojis/914993708913545236.webp?size=128",
  },
  navSecondary: [
    {
      title: "Configuración",
      url: "#",
      icon: IconSettings,
    }
  ],
  documents: [
    {
      name: "Base de datos",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Informes",
      url: "#",
      icon: IconReport,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <IconBrain className="!size-5" />
                <span className="text-base font-semibold">Grupo Einsteins</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
