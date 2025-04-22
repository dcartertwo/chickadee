import type { FC } from "hono/jsx";
import Chart, { type Data, type Options } from "../islands/chart";
import type { IGranularity, ITimeline } from "../lib/db";

const Timeline: FC<{
  timeline: ITimeline;
  granularity: IGranularity;
}> = async ({ timeline, granularity }) => {
  const options: Options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {},
    scales: {
      x: {
        type: "time",
        time: {
          minUnit: granularity,
        },
        ticks: {
          source: "data",
        },
      },
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
    labels: timeline.map((item) => item.timestamp),
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
