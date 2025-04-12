'use client';

import { ColumnDef } from "@tanstack/react-table";
import {formatDate, formatDateFull} from "@/lib/date";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export type TemperatureDataPoint = {
  timestamp: number;
  value: number;
  device: string;
}

export const temperatureColumns: ColumnDef<TemperatureDataPoint>[] = [
  {
    accessorKey: "timestamp",
    header: "Marca de tiempo",
    cell: ({ row }) => {
      const timestamp: number = row.getValue("timestamp");
      return (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{formatDate(timestamp)}</TooltipTrigger>
              <TooltipContent>
                <p>{formatDateFull(timestamp)} ({timestamp})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  },
  {
    accessorKey: "value",
    header: "Temperatura"
  },
  {
    accessorKey: "device",
    header: "Dispositivo"
  }
]