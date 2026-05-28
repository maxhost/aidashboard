import type { Company, IcpType } from "@/lib/data/types";

// Stubbed — Pulsor backend doesn't model companies yet. Pages render empty.
export async function listCompanies(): Promise<Company[]> {
  return [];
}

export async function getCompany(_id: string): Promise<Company | null> {
  return null;
}

export async function createCompany(_input: {
  name: string;
  icp_type: IcpType;
}): Promise<Company> {
  throw new Error("createCompany not implemented (no companies in Pulsor backend yet)");
}

export async function updateCompany(
  _id: string,
  _patch: { name?: string; icp_type?: IcpType },
): Promise<void> {
  // no-op
}

export async function deleteCompany(_id: string): Promise<void> {
  // no-op
}
