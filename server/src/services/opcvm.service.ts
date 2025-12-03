import {
  OPCVM,
  OPCVMCategory,
  OPCVMFilterOptions,
  OPCVMHistory,
  OPCVMSimulationInput,
  OPCVMSimulationResult,
} from '../types/opcvm.types';
import { opcvmList, opcvmHistoryMap } from '../data/opcvm-mock';

function matchesSearch(value: string, search?: string) {
  if (!search) return true;
  return value.toLowerCase().includes(search.toLowerCase());
}

export function getAllOPCVM(filters: OPCVMFilterOptions = {}): OPCVM[] {
  const { category, managementCompany, riskLevel, search, sortBy, sortOrder = 'desc' } = filters;

  let results = [...opcvmList];

  if (category) {
    results = results.filter((item) => item.category === category);
  }

  if (managementCompany) {
    results = results.filter((item) =>
      item.managementCompany.toLowerCase().includes(managementCompany.toLowerCase())
    );
  }

  if (riskLevel) {
    results = results.filter((item) => item.riskLevel === riskLevel);
  }

  if (search) {
    results = results.filter(
      (item) =>
        matchesSearch(item.name, search) ||
        matchesSearch(item.managementCompany, search) ||
        (item.isin && matchesSearch(item.isin, search))
    );
  }

  if (sortBy) {
    results.sort((a, b) => {
      const aVal = (a[sortBy] as number | undefined) ?? 0;
      const bVal = (b[sortBy] as number | undefined) ?? 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  return results;
}

export function getOPCVMById(id: string): OPCVM | undefined {
  return opcvmList.find((item) => item.id === id);
}

export function getOPCVMByCategory(category: OPCVMCategory): OPCVM[] {
  return opcvmList.filter((item) => item.category === category);
}

export function getOPCVMHistory(opcvmId: string, period?: string): OPCVMHistory[] {
  const history = opcvmHistoryMap[opcvmId] || [];
  if (!period) return history;

  const now = new Date();
  const start = new Date(now);

  switch (period) {
    case '1M':
      start.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(now.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return history;
  }

  return history.filter((point) => point.date >= start);
}

export function simulateInvestment(params: OPCVMSimulationInput): OPCVMSimulationResult {
  const {
    principal,
    rate,
    years,
    contribution = 0,
    contributionFrequency = 'monthly',
    managementFee = 0,
  } = params;

  const freqMap: Record<string, number> = {
    monthly: 12,
    quarterly: 4,
    yearly: 1,
    none: 1,
  };

  const periodsPerYear = freqMap[contributionFrequency] ?? 12;
  const totalPeriods = Math.max(1, Math.round(years * periodsPerYear));

  let balance = principal;
  let contributionTotal = 0;
  let feesTotal = 0;
  const timeline: OPCVMSimulationResult['timeline'] = [];

  const ratePerPeriod = rate / 100 / periodsPerYear;
  const feePerPeriod = managementFee / 100 / periodsPerYear;

  for (let period = 1; period <= totalPeriods; period++) {
    const gross = balance * (1 + ratePerPeriod);
    const feeCharge = gross * feePerPeriod;
    feesTotal += feeCharge;

    balance = gross - feeCharge;

    if (contribution > 0 && contributionFrequency !== 'none') {
      balance += contribution;
      contributionTotal += contribution;
    }

    if (period % periodsPerYear === 0 || period === totalPeriods) {
      const year = Math.ceil(period / periodsPerYear);
      timeline.push({
        year,
        value: parseFloat(balance.toFixed(2)),
        contributionTotal: parseFloat(contributionTotal.toFixed(2)),
        feesAccrued: parseFloat(feesTotal.toFixed(2)),
      });
    }
  }

  const finalValue = parseFloat(balance.toFixed(2));
  const grossGain = parseFloat((finalValue - principal - contributionTotal + feesTotal).toFixed(2));
  const netGain = parseFloat((finalValue - principal - contributionTotal).toFixed(2));

  return {
    finalValue,
    grossGain,
    feesTotal: parseFloat(feesTotal.toFixed(2)),
    netGain,
    timeline,
  };
}
