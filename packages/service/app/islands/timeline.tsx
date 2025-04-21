import type { FC } from "hono/jsx";
import Chart, { type ChartData, type ChartOptions } from "../components/chart";

const Timeline: FC = () => {
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
      name: "New users",
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: "#1A56DB",
    },
  ];

  return <Chart class="h-96 w-full" options={options} data={data} />;
};

export default Timeline;
