import { useEffect, useRef, useState, type FC } from "hono/jsx";
import { Chart as ChartJS, type ChartData, type ChartOptions } from "chart.js";

export type Data = ChartData<"line">;
export type Options = ChartOptions<"line">;

const Chart: FC<{
  class?: string;
  data: Data;
  options: Options;
}> = ({ class: cn = "", data, options }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<ChartJS<"line">>();

  // init
  useEffect(() => {
    async function init() {
      if (ref.current) {
        const chart = new ChartJS(ref.current, { type: "line", data, options });
        setChart(chart);
      }
    }
    init().catch(console.error);
  }, []);

  // update
  useEffect(() => {
    if (chart) chart.options = options;
  }, [options]);
  useEffect(() => {
    if (chart) chart.data = data;
  }, [data]);

  return (
    <div class={cn}>
      <canvas ref={ref} class="size-full" />
    </div>
  );
};

export default Chart;
