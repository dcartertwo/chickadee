import { createClient } from "honox/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-spacetime";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  TimeScale
);

// Set chart theme based on user's color scheme preference
function updateChartTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    // Dark mode
    ChartJS.defaults.backgroundColor = "rgba(255, 255, 255, 0.1)";
    ChartJS.defaults.borderColor = "rgba(255, 255, 255, 0.1)";
    ChartJS.defaults.color = "#999";
  } else {
    // Light mode
    ChartJS.defaults.backgroundColor = "rgba(0, 0, 0, 0.1)";
    ChartJS.defaults.borderColor = "rgba(0, 0, 0, 0.1)";
    ChartJS.defaults.color = "#666";
  }

  // Update all active charts
  Object.values(ChartJS.instances).forEach((chart) => {
    if (chart) chart.update();
  });
}
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
prefersDarkMode.addEventListener("change", (e) => updateChartTheme(e.matches));
updateChartTheme(prefersDarkMode.matches);

createClient();
