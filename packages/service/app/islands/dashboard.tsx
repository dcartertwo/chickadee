import { useState, type FC } from "hono/jsx";
import Stats from "../components/stats";
import Timeline from "../components/timeline";
import {
  type IGranularity,
  type IStats,
  type ITimeframe,
  type ITimeline,
  Metric,
} from "../lib/models";

interface Props {
  tf: ITimeframe;
  granularity: IGranularity;
  stats: IStats | null;
  timeline: ITimeline;
}

const Dashboard: FC<Props> = ({ tf, granularity, stats, timeline }) => {
  const [metric, setMetric] = useState<Metric>(Metric.Visitors);

  return (
    <div class="flex flex-col gap-4">
      <Stats stats={stats} metric={metric} setMetric={setMetric} />
      <Timeline timeline={timeline} granularity={granularity} metric={metric} />
      <Dimensions dimensions={dimensions} />
    </div>
  );
};

export default Dashboard;
