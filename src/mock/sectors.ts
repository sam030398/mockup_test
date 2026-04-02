import type { EmissionInput } from "../types";

export const SECTORS: { key: keyof EmissionInput; label: string; color: string }[] = [
  { key: "transport", label: "Transport", color: "#2c5282" },
  { key: "buildings", label: "Buildings", color: "#355c7d" },
  { key: "power", label: "Power", color: "#6c8ead" },
  { key: "waste", label: "Waste", color: "#9cafc8" },
  { key: "industry", label: "Industry", color: "#6b7280" },
  { key: "agriculture", label: "Agriculture", color: "#8b5e34" },
];
