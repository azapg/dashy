import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Loader2} from "lucide-react";

export type ActionableCardProps = {
  description: string;
}


export function ActionableCard({description}: ActionableCardProps) {
  const [available, setAvailable] = useState<boolean>(true);

  const fakeCooldown = () => {
    setAvailable(false);
    setTimeout(() => setAvailable(true), 1000)
  }

  return <Card className="@container/card">
    <CardHeader>
      <CardDescription>{description}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        <Button
          className={"w-full"}
          onClick={fakeCooldown}
          disabled={!available}>
          {available ? 'Enviar señal' : <><Loader2 className="animate-spin" /> Espere</>}
        </Button>
      </CardTitle>
    </CardHeader>
  </Card>;
}