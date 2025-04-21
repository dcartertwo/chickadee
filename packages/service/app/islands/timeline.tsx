import type { FC } from "hono/jsx";
import Chart, { type ChartData, type ChartOptions } from "../components/chart";
import type { ITimeline } from "../lib/db";

const Timeline: FC<{ timeline: ITimeline }> = async ({ timeline }) => {
  // TODO! show timestamps on xaxis

  const options: ChartOptions = {
    chart: {
      height: "100%",
      width: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    yaxis: {
      min: 0,
    },
  };

  const data: ChartData = [
    {
      name: "views",
      data: timeline.map((item) => item.views),
      color: "#1A56DB",
    },
    {
      name: "visitors",
      data: timeline.map((item) => item.visitors),
      color: "#10B981",
    },
  ];

  return <Chart class="h-96 w-full" options={options} data={data} />;
};

export default Timeline;
