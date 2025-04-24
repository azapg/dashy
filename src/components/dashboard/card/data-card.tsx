import {ReactNode} from "react";
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export type DataCardProps = {
  description: string;
  title: string;
  action: ReactNode;
}

export function DataCard({description, title, action}: DataCardProps) {
  return <Card className="@container/card">
    <CardHeader>
      <CardDescription>{description}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {title}
      </CardTitle>
      <CardAction>
        {action}
      </CardAction>
    </CardHeader>
  </Card>;
}