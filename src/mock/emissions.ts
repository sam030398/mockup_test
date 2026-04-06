import type { EmissionInput, EmissionRecord } from "../types";
import { NY_REDC_REGIONS } from "./regions";

const START_YEAR = 2005;
const END_YEAR = 2030;
const ACTUAL_END_YEAR = 2025;

const seedFromRegion = (regionId: string): number =>
  regionId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

const calculateTotals = (input: EmissionInput) => ({
  ...input,
  total: input.transport + input.buildings + input.power + input.waste + input.industry + input.agriculture,
});

const roundValue = (value: number): number => Math.max(0, Math.round(value));

export const generateSeedEmissions = (): EmissionRecord[] => {
  const now = new Date().toISOString();
  const records: EmissionRecord[] = [];

  NY_REDC_REGIONS.forEach((region, index) => {
    const seed = seedFromRegion(region.id) + index * 31;
    const baseTotal = 5_200_000 + seed * 3000;

    for (let year = START_YEAR; year <= END_YEAR; year += 1) {
      const elapsed = year - START_YEAR;
      const trendMultiplier = year <= ACTUAL_END_YEAR ? 1 - elapsed * 0.014 : 0.72 - (year - ACTUAL_END_YEAR) * 0.01;
      const seasonalFactor = 1 + Math.sin((elapsed + seed) / 3) * 0.02;
      const totalEstimate = baseTotal * trendMultiplier * seasonalFactor;

      const transport = roundValue(totalEstimate * 0.28);
      const buildings = roundValue(totalEstimate * 0.23);
      const power = roundValue(totalEstimate * 0.2);
      const waste = roundValue(totalEstimate * 0.1);
      const industry = roundValue(totalEstimate * 0.11);
      const agriculture = roundValue(totalEstimate * 0.08);
      const gdpBase = 55_000 + seed * 40;
      const gdp = roundValue(gdpBase * (1 + elapsed * 0.018));
      const populationBase = 900_000 + seed * 25;
      const population = roundValue(populationBase * (1 + elapsed * 0.01));
      const values = calculateTotals({ transport, buildings, power, waste, industry, agriculture, gdp, population });

      records.push({
        regionId: region.id,
        year,
        type: year <= ACTUAL_END_YEAR ? "actual" : "forecast",
        ...values,
        updatedBy: "seed_generator",
        updatedAt: now,
      });
    }
  });

  return records;
};

export const START_RANGE = START_YEAR;
export const END_RANGE = END_YEAR;
export const ACTUAL_TO_YEAR = ACTUAL_END_YEAR;
