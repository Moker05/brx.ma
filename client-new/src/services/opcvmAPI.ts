import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  currentVL: number;
  previousVL?: number;
  vlDate: string;

  return1Year?: number;
  return3Years?: number;
  return5Years?: number;
  returnSinceInception?: number;

  dailyChange?: number;
  weeklyChange?: number;
  monthlyChange?: number;

  riskLevel: number;
  managementFee: number;
  minSubscription: number;
  inceptionDate: string;

  assetValue?: number;
  numberOfShares?: number;
  description?: string;
  isActive: boolean;
}

export interface OPCVMHistory {
  id: string;
  opcvmId: string;
  vl: number;
  date: string;
}

export interface OPCVMSimulationRequest {
  opcvmId?: string;
  principal: number;
  rate: number;
  years: number;
  contribution?: number;
  contributionFrequency?: 'monthly' | 'quarterly' | 'yearly' | 'none';
  managementFee?: number;
}

export interface OPCVMSimulationResult {
  finalValue: number;
  grossGain: number;
  feesTotal: number;
  netGain: number;
  timeline: Array<{ year: number; value: number; contributionTotal: number; feesAccrued: number }>;
}

export interface OPCVMQueryParams {
  category?: OPCVMCategory;
  company?: string;
  risk?: number;
  search?: string;
  sortBy?: 'return1Year' | 'return3Years' | 'return5Years' | 'returnSinceInception';
  sortOrder?: 'asc' | 'desc';
}

export const getAllOPCVM = async (params: OPCVMQueryParams = {}): Promise<OPCVM[]> => {
  const response = await axios.get(`${API_URL}/opcvm`, { params });
  return response.data.data;
};

export const getOPCVMById = async (id: string): Promise<OPCVM> => {
  const response = await axios.get(`${API_URL}/opcvm/${id}`);
  return response.data.data;
};

export const getOPCVMByCategory = async (category: OPCVMCategory): Promise<OPCVM[]> => {
  const response = await axios.get(`${API_URL}/opcvm/category/${category}`);
  return response.data.data;
};

export const getOPCVMHistory = async (
  id: string,
  period?: '1M' | '3M' | '6M' | '1Y'
): Promise<OPCVMHistory[]> => {
  const response = await axios.get(`${API_URL}/opcvm/${id}/history`, {
    params: { period },
  });
  return response.data.data;
};

export const simulateInvestment = async (
  payload: OPCVMSimulationRequest
): Promise<OPCVMSimulationResult> => {
  const response = await axios.post(`${API_URL}/opcvm/simulate`, payload);
  return response.data.data;
};
