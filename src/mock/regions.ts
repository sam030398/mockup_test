import type { Region } from "../types";

export const NY_REDC_REGIONS: Region[] = [
  {
    id: "capital",
    name: "Capital Region",
    countyFips: ["36001", "36021", "36039", "36083", "36091", "36093", "36113", "36115"],
  },
  {
    id: "central_ny",
    name: "Central New York",
    countyFips: ["36011", "36023", "36053", "36067", "36075"],
  },
  {
    id: "finger_lakes",
    name: "Finger Lakes",
    countyFips: ["36037", "36051", "36055", "36069", "36073", "36099", "36117", "36121", "36123"],
  },
  {
    id: "long_island",
    name: "Long Island",
    countyFips: ["36059", "36103"],
  },
  {
    id: "mid_hudson",
    name: "Mid-Hudson",
    countyFips: ["36027", "36071", "36079", "36087", "36105", "36111", "36119"],
  },
  {
    id: "mohawk_valley",
    name: "Mohawk Valley",
    countyFips: ["36035", "36043", "36057", "36065", "36077", "36095"],
  },
  {
    id: "new_york_city",
    name: "New York City",
    countyFips: ["36005", "36047", "36061", "36081", "36085"],
  },
  {
    id: "north_country",
    name: "North Country",
    countyFips: ["36019", "36031", "36033", "36041", "36045", "36049", "36089"],
  },
  {
    id: "southern_tier",
    name: "Southern Tier",
    countyFips: ["36007", "36015", "36017", "36025", "36097", "36101", "36107", "36109"],
  },
  {
    id: "western_ny",
    name: "Western New York",
    countyFips: ["36003", "36009", "36013", "36029", "36063"],
  },
];

export const REGION_BY_FIPS: Record<string, Region> = NY_REDC_REGIONS.reduce<Record<string, Region>>(
  (acc, region) => {
    region.countyFips.forEach((fips) => {
      acc[fips] = region;
    });
    return acc;
  },
  {},
);

export const REGION_NAME_BY_ID = NY_REDC_REGIONS.reduce<Record<string, string>>((acc, region) => {
  acc[region.id] = region.name;
  return acc;
}, {});
