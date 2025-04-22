import { createClient } from "honox/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-spacetime";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  TimeScale,
  Tooltip
);

createClient();
