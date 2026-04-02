import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  type TooltipItem,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { EmissionRecord } from "../../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const formatMillionTco2e = (value: number): string => `${(value / 1_000_000).toFixed(1)} Million tCO2e`;

export function TrendLineChart({ records }: { records: EmissionRecord[] }) {
  const labels = records.map((record) => String(record.year));
  const actualSeries = records.map((record) => (record.type === "actual" ? record.total : null));
  const forecastSeries = records.map((record) => (record.type === "forecast" ? record.total : null));

  const data = {
    labels,
    datasets: [
      {
        label: "Actual",
        data: actualSeries,
        borderColor: "#2f5d50",
        backgroundColor: "#2f5d50",
        tension: 0.2,
        spanGaps: false,
      },
      {
        label: "Forecast",
        data: forecastSeries,
        borderColor: "#bf7f32",
        backgroundColor: "#bf7f32",
        borderDash: [6, 6],
        tension: 0.2,
        spanGaps: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const yValue = context.parsed.y ?? 0;
            return `${context.dataset.label ?? "Value"}: ${formatMillionTco2e(yValue)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => formatMillionTco2e(Number(value)),
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}
