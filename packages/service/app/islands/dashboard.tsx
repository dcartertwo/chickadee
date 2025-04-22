import type { FC } from "hono/jsx";
import Stats from "../components/stats";
import Timeline from "../components/timeline";
import type { IGranularity, IStats, ITimeline, ITimeframe } from "../lib/db";

interface Props {
  tf: ITimeframe;
  granularity: IGranularity;
  stats: IStats | null;
  timeline: ITimeline;
}

const Dashboard: FC<Props> = ({ granularity, stats, timeline }) => {
  return (
    <div class="flex flex-col gap-4">
      <Stats stats={stats} />
      <Timeline timeline={timeline} granularity={granularity} />
    </div>
  );
};

export default Dashboard;
