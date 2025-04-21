import { useEffect, useRef, useState, type FC } from "hono/jsx";
import { twMerge } from "tailwind-merge";

export type ChartOptions = Omit<ApexCharts.ApexOptions, "series">;
export type ChartData = ApexAxisChartSeries | ApexNonAxisChartSeries;

const Chart: FC<{
  class: string;
  options: ChartOptions;
  data: ChartData;
}> = ({ class: cn, options, data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<ApexCharts | null>(null);

  // init
  useEffect(() => {
    async function init() {
      const ApexCharts = (await import("apexcharts")).default;
      if (ref.current) {
        const chart = new ApexCharts(ref.current, { ...options, series: data });
        setChart(chart);
        await chart.render();
      }
    }
    init().catch(console.error);
  }, []);

  // update
  useEffect(() => {
    chart?.updateOptions(options);
  }, [options]);
  useEffect(() => {
    chart?.updateSeries(data);
  }, [data]);

  return (
    <div class={cn}>
      <div ref={ref} class="size-full" />
    </div>
  );
};

export default Chart;
