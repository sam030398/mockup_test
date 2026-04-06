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
const formatPerGdp = (value: number): string => value.toFixed(4);
const formatPerPopulation = (value: number): string => value.toFixed(4);

type TrendMetric = "total" | "emission_per_gdp" | "emission_per_population";

const metricLabelMap: Record<TrendMetric, string> = {
  total: "Million tCO2e",
  emission_per_gdp: "Emission per GDP",
  emission_per_population: "Emission per Population",
};

const metricFormatterMap: Record<TrendMetric, (value: number) => string> = {
  total: formatMillionTco2e,
  emission_per_gdp: formatPerGdp,
  emission_per_population: formatPerPopulation,
};

const valueForMetric = (record: EmissionRecord, metric: TrendMetric): number => {
  if (metric === "emission_per_gdp") {
    return record.gdp > 0 ? record.total / record.gdp : 0;
  }
  if (metric === "emission_per_population") {
    return record.population > 0 ? record.total / record.population : 0;
  }
  return record.total;
};

export function TrendLineChart({ records, metric = "total" }: { records: EmissionRecord[]; metric?: TrendMetric }) {
  const years = Array.from(new Set(records.map((record) => record.year))).sort((a, b) => a - b);
  const actualByYear = new Map<number, number | null>();
  const forecastByYear = new Map<number, number | null>();

  records.forEach((record) => {
    const value = valueForMetric(record, metric);
    if (record.type === "actual") {
      actualByYear.set(record.year, value);
      return;
    }
    forecastByYear.set(record.year, value);
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
            return `${context.dataset.label ?? "Value"}: ${metricFormatterMap[metric](yValue)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => metricFormatterMap[metric](Number(value)),
        },
        title: {
          display: true,
          text: metricLabelMap[metric],
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}
