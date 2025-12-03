export type OPCVMCategory =
  | 'ACTIONS'
  | 'OBLIGATIONS'
  | 'MONETAIRE'
  | 'DIVERSIFIE'
  | 'CONTRACTUEL'
  | 'ALTERNATIF';

export interface OPCVM {
  id: string;
  name: string;
  isin?: string;
  managementCompany: string;
  category: OPCVMCategory;
  subCategory?: string;

  // Valeur liquidative
  currentVL: number;
  previousVL?: number;
  vlDate: Date;

  // Performance
  return1Year?: number;
  return3Years?: number;
  return5Years?: number;
  returnSinceInception?: number;

  // Variations
  dailyChange?: number;
  weeklyChange?: number;
  monthlyChange?: number;

  // Informations
  riskLevel: number; // 1-7
  managementFee: number; // %
  minSubscription: number; // MAD
  inceptionDate: Date;

  // Donnees historiques
  assetValue?: number;
  numberOfShares?: number;

  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OPCVMHistory {
  id: string;
  opcvmId: string;
  vl: number;
  date: Date;
}

export interface OPCVMFilterOptions {
  category?: OPCVMCategory;
  managementCompany?: string;
  riskLevel?: number;
  search?: string;
  sortBy?: 'return1Year' | 'return3Years' | 'return5Years' | 'returnSinceInception';
  sortOrder?: 'asc' | 'desc';
}

export interface OPCVMSimulationInput {
  opcvmId?: string;
  principal: number;
  rate: number; // expected annual return in %
  years: number;
  contribution?: number; // periodic contribution amount
  contributionFrequency?: 'monthly' | 'quarterly' | 'yearly' | 'none';
  managementFee?: number; // annual mgmt fee in %
}

export interface OPCVMSimulationResult {
  finalValue: number;
  grossGain: number;
  feesTotal: number;
  netGain: number;
  timeline: Array<{ year: number; value: number; contributionTotal: number; feesAccrued: number }>;
}
