'use client';

import {ColumnDef} from "@tanstack/react-table";
import {formatDate, formatDateFull} from "@/lib/date";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type DataPoint = {
  timestamp: number;
  value: number;
  unit: string;
  device: string;
}

export const standardColumns: ColumnDef<DataPoint>[] = [
  {
    accessorKey: "timestamp",
    header: "Marca de tiempo",
    cell: ({row}) => {
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
    header: "Medida"
  },
  {
    accessorKey: "device",
    header: "Dispositivo",
  }
]