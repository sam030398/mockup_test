import { createContext, useContext, useMemo, useState } from "react";
import { END_RANGE, START_RANGE, generateSeedEmissions } from "../mock/emissions";
import type { EmissionInput, EmissionRecord } from "../types";

type EmissionsContextType = {
  records: EmissionRecord[];
  years: number[];
  getRecord: (regionId: string, year: number) => EmissionRecord | undefined;
  getRegionRecords: (regionId: string) => EmissionRecord[];
  upsertRecord: (
    regionId: string,
    year: number,
    values: EmissionInput,
    updatedBy: string,
    type?: EmissionRecord["type"],
  ) => void;
};

const STORAGE_KEY = "ny-ghg-emissions";
const EmissionsContext = createContext<EmissionsContextType | undefined>(undefined);

const normalizeRecord = (record: EmissionRecord): EmissionRecord => {
  const normalized: EmissionRecord = {
    ...record,
    transport: record.transport ?? 0,
    buildings: record.buildings ?? 0,
    power: record.power ?? 0,
    waste: record.waste ?? 0,
    industry: record.industry ?? 0,
    agriculture: record.agriculture ?? 0,
    total:
      (record.transport ?? 0) +
      (record.buildings ?? 0) +
      (record.power ?? 0) +
      (record.waste ?? 0) +
      (record.industry ?? 0) +
      (record.agriculture ?? 0),
  };

  return normalized;
};

const readRecords = (): EmissionRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return generateSeedEmissions();
  }
  try {
    const parsed = JSON.parse(stored) as EmissionRecord[];
    return parsed.map(normalizeRecord);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return generateSeedEmissions();
  }
};

export function EmissionsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<EmissionRecord[]>(() => readRecords());

  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = START_RANGE; year <= END_RANGE; year += 1) {
      list.push(year);
    }
    return list;
  }, []);

  const getRecord = (regionId: string, year: number) => {
    const matching = records.filter((record) => record.regionId === regionId && record.year === year);
    const actual = matching.find((record) => record.type === "actual");
    if (actual) {
      return actual;
    }
    return matching.find((record) => record.type === "forecast");
  };

  const getRegionRecords = (regionId: string) =>
    records.filter((record) => record.regionId === regionId).sort((a, b) => a.year - b.year);

  const upsertRecord = (
    regionId: string,
    year: number,
    values: EmissionInput,
    updatedBy: string,
    type: EmissionRecord["type"] = "actual",
  ) => {
    const nextRecord: EmissionRecord = {
      regionId,
      year,
      type,
      transport: values.transport,
      buildings: values.buildings,
      power: values.power,
      waste: values.waste,
      industry: values.industry,
      agriculture: values.agriculture,
      total: values.transport + values.buildings + values.power + values.waste + values.industry + values.agriculture,
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    setRecords((current) => {
      const exists = current.some(
        (record) => record.regionId === regionId && record.year === year && record.type === type,
      );
      const updated = exists
        ? current.map((record) =>
            record.regionId === regionId && record.year === year && record.type === type ? nextRecord : record,
          )
        : [...current, nextRecord];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(
    () => ({
      records,
      years,
      getRecord,
      getRegionRecords,
      upsertRecord,
    }),
    [records, years],
  );

  return <EmissionsContext.Provider value={value}>{children}</EmissionsContext.Provider>;
}

export const useEmissions = (): EmissionsContextType => {
  const context = useContext(EmissionsContext);
  if (!context) {
    throw new Error("useEmissions must be used within EmissionsProvider");
  }
  return context;
};
