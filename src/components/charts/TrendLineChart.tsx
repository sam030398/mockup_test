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
  const years = Array.from(new Set(records.map((record) => record.year))).sort((a, b) => a - b);
  const actualByYear = new Map<number, number>();
  const forecastByYear = new Map<number, number>();

  records.forEach((record) => {
    if (record.type === "actual") {
      actualByYear.set(record.year, record.total);
      return;
    }
    forecastByYear.set(record.year, record.total);
  });

  const labels = years.map((year) => String(year));
  const actualSeries = years.map((year) => actualByYear.get(year) ?? null);
  const forecastSeries = years.map((year) => forecastByYear.get(year) ?? null);

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
