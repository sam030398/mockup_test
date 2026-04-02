import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { SECTORS } from "../../mock/sectors";
import type { EmissionRecord } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

export function SectorPieChart({ record }: { record: EmissionRecord | undefined }) {
  if (!record) {
    return <p className="empty-message">No data available for the selected year.</p>;
  }

  const data = {
    labels: SECTORS.map((sector) => sector.label),
    datasets: [
      {
        data: SECTORS.map((sector) => record[sector.key]),
        backgroundColor: SECTORS.map((sector) => sector.color),
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
}
