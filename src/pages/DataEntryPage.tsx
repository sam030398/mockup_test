import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmissions } from "../context/EmissionsContext";
import { NY_REDC_REGIONS, REGION_NAME_BY_ID } from "../mock/regions";
import { SECTORS } from "../mock/sectors";
import type { EmissionInput } from "../types";

const asNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export function DataEntryPage() {
  const { user } = useAuth();
  const { years, getRecord, upsertRecord } = useEmissions();

  const editableRegions =
    user?.role === "super_admin"
      ? NY_REDC_REGIONS.map((region) => region.id)
      : (user?.assignedRegionIds ?? []);

  const [selectedRegion, setSelectedRegion] = useState(editableRegions[0] ?? "");
  const [draft, setDraft] = useState<Record<number, EmissionInput>>({});

  const rows = useMemo(
    () =>
      years
        .filter((year) => year >= 2026 && year <= 2030)
        .map((year) => {
        const existing = getRecord(selectedRegion, year);
        return {
          year,
          values: draft[year] ?? {
            transport: existing?.transport ?? 0,
            buildings: existing?.buildings ?? 0,
            power: existing?.power ?? 0,
            waste: existing?.waste ?? 0,
            industry: existing?.industry ?? 0,
            agriculture: existing?.agriculture ?? 0,
            gdp: existing?.gdp ?? 0,
            population: existing?.population ?? 0,
          },
        };
      }),
    [draft, getRecord, selectedRegion, years],
  );

  const updateField = (year: number, field: keyof EmissionInput, value: string) => {
    setDraft((current) => {
      const base = current[year] ?? {
        transport: getRecord(selectedRegion, year)?.transport ?? 0,
        buildings: getRecord(selectedRegion, year)?.buildings ?? 0,
        power: getRecord(selectedRegion, year)?.power ?? 0,
        waste: getRecord(selectedRegion, year)?.waste ?? 0,
        industry: getRecord(selectedRegion, year)?.industry ?? 0,
        agriculture: getRecord(selectedRegion, year)?.agriculture ?? 0,
        gdp: getRecord(selectedRegion, year)?.gdp ?? 0,
        population: getRecord(selectedRegion, year)?.population ?? 0,
      };
      return {
        ...current,
        [year]: { ...base, [field]: asNumber(value) },
      };
    });
  };

  const saveYear = (year: number) => {
    const values = draft[year];
    if (!values || !user || !selectedRegion) {
      return;
    }
    upsertRecord(selectedRegion, year, values, user.email, "actual");
  };

  if (!editableRegions.length) {
    return (
      <section className="card">
        <h2>No editable councils</h2>
        <p className="muted">This user is not assigned to any regional council.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Input Emissions by Sector</h2>
          <p className="muted">Submit actual values for 2026-2030 in tCO2e (forecast baseline remains unchanged)</p>
        </div>
        <label>
          Regional Council
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            {editableRegions.map((regionId) => (
              <option key={regionId} value={regionId}>
                {REGION_NAME_BY_ID[regionId]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              {SECTORS.map((sector) => (
                <th key={sector.key}>{sector.label}</th>
              ))}
              <th>GDP</th>
              <th>Population</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const total = SECTORS.reduce((sum, sector) => sum + row.values[sector.key], 0);
              return (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  {SECTORS.map((sector) => (
                    <td key={sector.key}>
                      <input
                        type="number"
                        min={0}
                        value={row.values[sector.key]}
                        onChange={(e) => updateField(row.year, sector.key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={row.values.gdp}
                      onChange={(e) => updateField(row.year, "gdp", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={row.values.population}
                      onChange={(e) => updateField(row.year, "population", e.target.value)}
                    />
                  </td>
                  <td>{total.toLocaleString()}</td>
                  <td>
                    <button type="button" className="button secondary" onClick={() => saveYear(row.year)}>
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
