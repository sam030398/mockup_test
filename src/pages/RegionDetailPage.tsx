import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SectorPieChart } from "../components/charts/SectorPieChart";
import { TrendLineChart } from "../components/charts/TrendLineChart";
import { useAuth } from "../context/AuthContext";
import { useEmissions } from "../context/EmissionsContext";
import { REGION_NAME_BY_ID } from "../mock/regions";

export function RegionDetailPage() {
  const { regionId = "" } = useParams();
  const { user } = useAuth();
  const { years, getRecord, getRegionRecords } = useEmissions();
  const [selectedYear, setSelectedYear] = useState(2025);

  const permitted = user?.role === "super_admin" || user?.assignedRegionIds.includes(regionId);
  const regionLabel = REGION_NAME_BY_ID[regionId];
  const selectedRecord = getRecord(regionId, selectedYear);
  const regionSeries = useMemo(() => getRegionRecords(regionId), [getRegionRecords, regionId]);

  if (!regionLabel) {
    return <Navigate to="/dashboard/map" replace />;
  }

  if (!permitted) {
    return (
      <section className="card">
        <h2>Access restricted</h2>
        <p className="muted">You are not assigned to this regional council.</p>
        <Link className="button primary" to="/dashboard/map">
          Back to map
        </Link>
      </section>
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>{regionLabel}</h2>
            <p className="muted">Council detail view with sector composition and trend</p>
          </div>
          <label>
            Year
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="kpi">
          <span>Total GHG Emission</span>
          <strong>{selectedRecord?.total.toLocaleString() ?? "No data"} tCO2e</strong>
        </div>
      </section>

      <section className="card chart-card">
        <h3>Sector Breakdown ({selectedYear})</h3>
        <div className="chart-body chart-body-pie">
          <SectorPieChart record={selectedRecord} />
        </div>
      </section>

      <section className="card chart-card line-card">
        <h3>Trend: Actual vs Forecast (2005-2030)</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={regionSeries} />
        </div>
      </section>
    </div>
  );
}
