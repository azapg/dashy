import { get } from "@/lib/fetch";

export type Experiment = {
  experiment_id: number;
  title: string;
  description: string | null;
  icon_name: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_by: number,
  created_at: string,
  updated_at: string,
  creator_name: string
}

type ExperimentResponse = {
  experiments: Experiment[];
}

export async function getExperiments() {
  return await get<ExperimentResponse>("experiments/list.php");
}