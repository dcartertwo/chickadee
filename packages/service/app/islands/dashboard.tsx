import { Fragment, type FC } from "hono/jsx";
import Stats from "../components/stats";
import Timeline from "../components/timeline";
import type { IGranularity, IStats, ITimeline, ITimeframe } from "../lib/db";
import Chart from "./chart";

interface Props {
  tf: ITimeframe;
  granularity: IGranularity;
  stats: IStats | null;
  timeline: ITimeline;
}

const Dashboard: FC<Props> = ({ granularity, stats, timeline }) => {
  return (
    <Fragment>
      <Stats stats={stats} />
      <Timeline timeline={timeline} granularity={granularity} />
    </Fragment>
  );
};

export default Dashboard;
