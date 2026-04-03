export type UserRole = "super_admin" | "data_owner";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedRegionIds: string[];
  provider: "firebase" | "auth0";
};

export type Region = {
  id: string;
  name: string;
  countyFips: string[];
  polygon?: [number, number][];
  labelPosition?: [number, number];
};

export type EmissionType = "actual" | "forecast";

export type EmissionSectors = {
  transport: number;
  buildings: number;
  power: number;
  waste: number;
  industry: number;
  agriculture: number;
};

export type EmissionRecord = {
  regionId: string;
  year: number;
  type: EmissionType;
} & EmissionSectors & {
  total: number;
  updatedBy: string;
  updatedAt: string;
};

export type EmissionInput = EmissionSectors;
