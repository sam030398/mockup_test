import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendLineChart } from "../components/charts/TrendLineChart";
import { NyRegionalMap } from "../components/NyRegionalMap";
import { useEmissions } from "../context/EmissionsContext";
import { NY_REDC_REGIONS } from "../mock/regions";
import type { EmissionRecord } from "../types";

export function MapPage() {
  const navigate = useNavigate();
  const { getRecord, years, records } = useEmissions();
  const [selectedYear, setSelectedYear] = useState(2025);

  const regionSummaries = useMemo(
    () =>
      NY_REDC_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        total: getRecord(region.id, selectedYear)?.total ?? 0,
      })),
    [getRecord, selectedYear],
  );

  const statewideTrend = useMemo<EmissionRecord[]>(() => {
    const totalsByYearAndType = records.reduce<Record<string, { total: number; gdp: number; population: number }>>(
      (acc, record) => {
      const key = `${record.year}-${record.type}`;
      const current = acc[key] ?? { total: 0, gdp: 0, population: 0 };
      acc[key] = {
        total: current.total + record.total,
        gdp: current.gdp + record.gdp,
        population: current.population + record.population,
      };
      return acc;
      },
      {},
    );

    return Object.entries(totalsByYearAndType)
      .map(([compositeKey, values]) => {
        const [yearValue, typeValue] = compositeKey.split("-");
        const numericYear = Number(yearValue);
        return {
          regionId: "statewide",
          year: numericYear,
          type: typeValue === "actual" ? ("actual" as const) : ("forecast" as const),
          transport: 0,
          buildings: 0,
          power: 0,
          waste: 0,
          industry: 0,
          agriculture: 0,
          gdp: values.gdp,
          population: values.population,
          total: values.total,
          updatedAt: "",
          updatedBy: "aggregate",
        };
      })
      .sort((a, b) => (a.year === b.year ? a.type.localeCompare(b.type) : a.year - b.year));
  }, [records]);

  return (
    <div className="stack">
      <section className="card">
        <div className="section-header">
          <h2>Regional Council Map</h2>
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

        <NyRegionalMap onRegionSelect={(regionId) => navigate(`/dashboard/region/${regionId}`)} />
      </section>

      <section className="card">
        <h3>Regional totals for {selectedYear}</h3>
        <div className="summary-grid">
          {regionSummaries.map((summary) => (
            <button
              type="button"
              key={summary.id}
              className="summary-item"
              onClick={() => navigate(`/dashboard/region/${summary.id}`)}
            >
              <span>{summary.name}</span>
              <strong>{summary.total.toLocaleString()} tCO2e</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="card chart-card compact-line-card">
        <h3>Overall Selangor Trend (Actual vs Forecast, 2005-2050)</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={statewideTrend} />
        </div>
      </section>

      <section className="card chart-card compact-line-card">
        <h3>Overall Selangor Emission per GDP (Actual vs Forecast, 2005-2050)</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={statewideTrend} metric="emission_per_gdp" />
        </div>
      </section>

      <section className="card chart-card compact-line-card">
        <h3>Overall Selangor Emission per Population (Actual vs Forecast, 2005-2050)</h3>
        <div className="chart-body chart-body-line">
          <TrendLineChart records={statewideTrend} metric="emission_per_population" />
        </div>
      </section>
    </div>
  );
}
