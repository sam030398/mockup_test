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
  const actualRows = useMemo(
    () => regionSeries.filter((record) => record.type === "actual").sort((a, b) => a.year - b.year),
    [regionSeries],
  );
  const projectionRows = useMemo(
    () => regionSeries.filter((record) => record.type === "forecast").sort((a, b) => a.year - b.year),
    [regionSeries],
  );
  const emissionPerGdp = selectedRecord && selectedRecord.gdp > 0 ? selectedRecord.total / selectedRecord.gdp : 0;
  const emissionPerPopulation =
    selectedRecord && selectedRecord.population > 0 ? selectedRecord.total / selectedRecord.population : 0;

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
        <div className="kpi-grid">
          <div className="kpi">
            <span>GDP</span>
            <strong>{selectedRecord?.gdp.toLocaleString() ?? "No data"}</strong>
          </div>
          <div className="kpi">
            <span>Population</span>
            <strong>{selectedRecord?.population.toLocaleString() ?? "No data"}</strong>
          </div>
          <div className="kpi">
            <span>Emission per GDP</span>
            <strong>{emissionPerGdp.toFixed(4)}</strong>
          </div>
          <div className="kpi">
            <span>Emission per Population</span>
            <strong>{emissionPerPopulation.toFixed(4)}</strong>
          </div>
        </div>
      </section>

      <section className="card chart-card">
        <h3>Sector Breakdown ({selectedYear})</h3>
        <div className="chart-body chart-body-pie">
          <SectorPieChart record={selectedRecord} />
        </div>
      </section>

      <section className="card chart-card line-card">
        <h3>Trend: Actual vs Forecast (2005-2050)</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={regionSeries} />
        </div>
      </section>

      <section className="card chart-card line-card">
        <h3>Trend: Actual vs Forecast Emission per GDP</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={regionSeries} metric="emission_per_gdp" />
        </div>
      </section>

      <section className="card chart-card line-card">
        <h3>Trend: Actual vs Forecast Emission per Population</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={regionSeries} metric="emission_per_population" />
        </div>
      </section>

      <section className="card">
        <h3>Actual Data Table</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Emission</th>
                <th>GDP</th>
                <th>Population</th>
                <th>Emission per GDP</th>
                <th>Emission per Population</th>
              </tr>
            </thead>
            <tbody>
              {actualRows.map((row) => (
                <tr key={`actual-${row.year}`}>
                  <td>{row.year}</td>
                  <td>{row.total.toLocaleString()}</td>
                  <td>{row.gdp.toLocaleString()}</td>
                  <td>{row.population.toLocaleString()}</td>
                  <td>{(row.gdp > 0 ? row.total / row.gdp : 0).toFixed(4)}</td>
                  <td>{(row.population > 0 ? row.total / row.population : 0).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Projection Data Table</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Emission</th>
                <th>GDP</th>
                <th>Population</th>
                <th>Emission per GDP</th>
                <th>Emission per Population</th>
              </tr>
            </thead>
            <tbody>
              {projectionRows.map((row) => (
                <tr key={`forecast-${row.year}`}>
                  <td>{row.year}</td>
                  <td>{row.total.toLocaleString()}</td>
                  <td>{row.gdp.toLocaleString()}</td>
                  <td>{row.population.toLocaleString()}</td>
                  <td>{(row.gdp > 0 ? row.total / row.gdp : 0).toFixed(4)}</td>
                  <td>{(row.population > 0 ? row.total / row.population : 0).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
