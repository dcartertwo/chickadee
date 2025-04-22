import type { FC } from "hono/jsx";
import type { IStats } from "../lib/db";
import { Metric } from "../lib/models";

const Stats: FC<{
  stats: IStats | null;
  metric: Metric;
  setMetric: (metric: Metric) => void;
}> = ({ stats, metric, setMetric }) => {
  return (
    <div class="stats shadow stats-vertical sm:stats-horizontal">
      {/* Visitors */}
      <button
        type="button"
        class="stat"
        onClick={() => setMetric(Metric.Visitors)}
      >
        <div class="stat-figure">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <title>Visitors</title>
            <path
              fill="currentColor"
              d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"
            />
          </svg>
        </div>
        <div class="stat-title">Visitors</div>
        <div class="stat-value">{stats?.visitors}</div>
        <div class="stat-desc">
          {stats?.visitorsGrowth ? `${stats.visitorsGrowth}%` : ""}
        </div>
        {metric === Metric.Visitors && (
          <div class="w-full h-1 bg-accent mt-2 col-span-3" />
        )}
      </button>

      {/* Page Views */}
      <button
        type="button"
        class="stat"
        onClick={() => setMetric(Metric.Pageviews)}
      >
        <div class="stat-figure">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <title>Page Views</title>
            <path
              fill="currentColor"
              d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 25c-5.3 0-10.9-3.93-12.93-9C5.1 10.93 10.7 7 16 7s10.9 3.93 12.93 9C26.9 21.07 21.3 25 16 25"
            />
            <path
              fill="currentColor"
              d="M16 10a6 6 0 1 0 6 6a6 6 0 0 0-6-6m0 10a4 4 0 1 1 4-4a4 4 0 0 1-4 4"
            />
          </svg>
        </div>
        <div class="stat-title">Page Views</div>
        <div class="stat-value">{stats?.views}</div>
        <div class="stat-desc">
          {stats?.viewsGrowth ? `${stats.viewsGrowth}%` : ""}
        </div>
        {metric === Metric.Pageviews && (
          <div class="w-full h-1 bg-accent mt-2 col-span-3" />
        )}
      </button>

      {/* TODO bounce rate? */}
      {/* <div class="stat">
        <div class="stat-figure text-secondary">
          <div class="avatar online">
            <div class="w-16 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
        <div class="stat-value">86%</div>
        <div class="stat-title">Tasks done</div>
        <div class="stat-desc text-secondary">31 tasks remaining</div>
      </div> */}
    </div>
  );
};
export default Stats;
