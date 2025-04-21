import type { FC } from "hono/jsx";
import Chart, { type Data, type Options } from "../islands/chart";
import { getTimeline, type ITimeframe } from "../lib/db";
import { useRequestContext } from "hono/jsx-renderer";
import type { Env } from "hono";

const Timeline: FC<{ sid: string; tf: ITimeframe }> = async ({ sid, tf }) => {
  const c = useRequestContext<Env>();
  const timeline = await getTimeline(c, sid, tf);

  const options: Options = {
    responsive: true,
    plugins: {},
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const data: Data = {
    // TODO! either date or hour, depending on granularity
    labels: timeline.map((item) => item.timestamp.toLocaleString()),
    datasets: [
      {
        label: "Views",
        data: timeline.map((item) => item.views),
        borderColor: "#1A56DB",
        backgroundColor: "#1A56DB80",
      },
      {
        label: "Visitors",
        data: timeline.map((item) => item.visitors),
        borderColor: "#10B981",
        backgroundColor: "#10B98180",
      },
    ],
  };

  return <Chart class="h-96 w-full" options={options} data={data} />;
};

export default Timeline;
