import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAllOPCVM,
  getOPCVMById,
  getOPCVMHistory,
  simulateInvestment,
} from '../services/opcvmAPI';
import type { OPCVMSimulationRequest, OPCVMQueryParams } from '../services/opcvmAPI';

export const useOPCVMList = (filters: OPCVMQueryParams = {}) => {
  return useQuery({
    queryKey: ['opcvmList', filters],
    queryFn: () => getAllOPCVM(filters),
    staleTime: 60000,
  });
};

export const useOPCVMDetail = (id?: string) => {
  return useQuery({
    queryKey: ['opcvmDetail', id],
    queryFn: () => getOPCVMById(id as string),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useOPCVMHistory = (id?: string, period?: '1M' | '3M' | '6M' | '1Y') => {
  return useQuery({
    queryKey: ['opcvmHistory', id, period],
    queryFn: () => getOPCVMHistory(id as string, period),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useOPCVMSimulation = () => {
  return useMutation({
    mutationKey: ['opcvmSimulation'],
    mutationFn: (payload: OPCVMSimulationRequest) => simulateInvestment(payload),
  });
};
