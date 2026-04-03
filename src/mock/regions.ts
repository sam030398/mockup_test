import type { Region } from "../types";

export const SELANGOR_OUTLINE: [number, number][] = [
  [3.9, 100.9],
  [3.92, 101.25],
  [3.85, 101.55],
  [3.78, 101.86],
  [3.45, 101.9],
  [3.12, 101.9],
  [2.72, 101.84],
  [2.68, 101.5],
  [2.7, 101.2],
  [2.85, 100.95],
  [3.2, 100.88],
  [3.55, 100.9],
  [3.9, 100.9],
];

export const NY_REDC_REGIONS: Region[] = [
  {
    id: "petaling_jaya",
    name: "Petaling Jaya",
    countyFips: [],
    polygon: [
      [3.05, 101.2],
      [3.25, 101.2],
      [3.25, 101.45],
      [3.05, 101.45],
    ],
    labelPosition: [3.15, 101.325],
  },
  {
    id: "shah_alam",
    name: "Shah Alam",
    countyFips: [],
    polygon: [
      [3.25, 101.2],
      [3.5, 101.2],
      [3.5, 101.45],
      [3.25, 101.45],
    ],
    labelPosition: [3.37, 101.325],
  },
  {
    id: "subang_jaya",
    name: "Subang Jaya",
    countyFips: [],
    polygon: [
      [3.05, 101.45],
      [3.25, 101.45],
      [3.25, 101.65],
      [3.05, 101.65],
    ],
    labelPosition: [3.15, 101.55],
  },
  {
    id: "klang",
    name: "Klang",
    countyFips: [],
    polygon: [
      [2.9, 100.95],
      [3.25, 100.95],
      [3.25, 101.2],
      [2.9, 101.2],
    ],
    labelPosition: [3.08, 101.08],
  },
  {
    id: "ampang_jaya",
    name: "Ampang Jaya",
    countyFips: [],
    polygon: [
      [3.25, 101.65],
      [3.5, 101.65],
      [3.5, 101.85],
      [3.25, 101.85],
    ],
    labelPosition: [3.37, 101.75],
  },
  {
    id: "kajang",
    name: "Kajang",
    countyFips: [],
    polygon: [
      [3.05, 101.65],
      [3.25, 101.65],
      [3.25, 101.85],
      [3.05, 101.85],
    ],
    labelPosition: [3.15, 101.75],
  },
  {
    id: "sepang",
    name: "Sepang",
    countyFips: [],
    polygon: [
      [2.72, 101.2],
      [3.05, 101.2],
      [3.05, 101.65],
      [2.72, 101.65],
    ],
    labelPosition: [2.88, 101.425],
  },
  {
    id: "selayang",
    name: "Selayang",
    countyFips: [],
    polygon: [
      [3.25, 101.45],
      [3.5, 101.45],
      [3.5, 101.65],
      [3.25, 101.65],
    ],
    labelPosition: [3.37, 101.55],
  },
  {
    id: "kuala_selangor",
    name: "Kuala Selangor",
    countyFips: [],
    polygon: [
      [3.25, 100.95],
      [3.5, 100.95],
      [3.5, 101.2],
      [3.25, 101.2],
    ],
    labelPosition: [3.37, 101.08],
  },
  {
    id: "hulu_selangor",
    name: "Hulu Selangor",
    countyFips: [],
    polygon: [
      [3.5, 101.2],
      [3.9, 101.2],
      [3.9, 101.85],
      [3.5, 101.85],
    ],
    labelPosition: [3.7, 101.52],
  },
  {
    id: "kuala_langat",
    name: "Kuala Langat",
    countyFips: [],
    polygon: [
      [2.72, 100.95],
      [2.9, 100.95],
      [2.9, 101.2],
      [2.72, 101.2],
    ],
    labelPosition: [2.81, 101.08],
  },
  {
    id: "sabak_bernam",
    name: "Sabak Bernam",
    countyFips: [],
    polygon: [
      [3.5, 100.95],
      [3.9, 100.95],
      [3.9, 101.2],
      [3.5, 101.2],
    ],
    labelPosition: [3.7, 101.08],
  },
];

export const REGION_NAME_BY_ID = NY_REDC_REGIONS.reduce<Record<string, string>>((acc, region) => {
  acc[region.id] = region.name;
  return acc;
}, {});

export const REGION_ID_BY_PBT_NAME: Record<string, string> = {
  "shah alam": "shah_alam",
  "petaling jaya": "petaling_jaya",
  "subang jaya": "subang_jaya",
  "ampang jaya": "ampang_jaya",
  kajang: "kajang",
  klang: "klang",
  sepang: "sepang",
  selayang: "selayang",
  "kuala selangor": "kuala_selangor",
  "hulu selangor": "hulu_selangor",
  "kuala langat": "kuala_langat",
  "sabak bernam": "sabak_bernam",
};
