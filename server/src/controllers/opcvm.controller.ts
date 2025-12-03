import { Request, Response } from 'express';
import {
  getAllOPCVM,
  getOPCVMByCategory,
  getOPCVMById,
  getOPCVMHistory,
  simulateInvestment,
} from '../services/opcvm.service';
import { OPCVMCategory } from '../types/opcvm.types';

export const listOPCVM = (req: Request, res: Response) => {
  try {
    const { category, company, risk, search, sortBy, sortOrder } = req.query;

    const data = getAllOPCVM({
      category: category ? (String(category).toUpperCase() as OPCVMCategory) : undefined,
      managementCompany: company ? String(company) : undefined,
      riskLevel: risk ? Number(risk) : undefined,
      search: search ? String(search) : undefined,
      sortBy: sortBy ? (String(sortBy) as any) : undefined,
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Error listing OPCVM:', error);
    res.status(500).json({ error: 'Failed to fetch OPCVM list' });
  }
};

export const getOPCVMDetails = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const opcvm = getOPCVMById(id);

    if (!opcvm) {
      return res.status(404).json({ error: 'OPCVM not found' });
    }

    res.json({
      success: true,
      data: opcvm,
    });
  } catch (error) {
    console.error('Error getting OPCVM details:', error);
    res.status(500).json({ error: 'Failed to fetch OPCVM' });
  }
};

export const getOPCVMByCategoryHandler = (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const normalized = String(category).toUpperCase() as OPCVMCategory;
    const data = getOPCVMByCategory(normalized);

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Error getting OPCVM by category:', error);
    res.status(500).json({ error: 'Failed to fetch OPCVM by category' });
  }
};

export const getOPCVMHistoryHandler = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { period } = req.query;

    const history = getOPCVMHistory(id, period ? String(period) : undefined);

    if (!history.length) {
      return res.status(404).json({ error: 'History not found for this OPCVM' });
    }

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('Error getting OPCVM history:', error);
    res.status(500).json({ error: 'Failed to fetch OPCVM history' });
  }
};

export const simulateOPCVMInvestment = (req: Request, res: Response) => {
  try {
    const { principal, rate, years, contribution, contributionFrequency, managementFee, opcvmId } =
      req.body;

    if (!principal || !rate || !years) {
      return res.status(400).json({ error: 'principal, rate and years are required' });
    }

    const result = simulateInvestment({
      opcvmId,
      principal: Number(principal),
      rate: Number(rate),
      years: Number(years),
      contribution: contribution !== undefined ? Number(contribution) : undefined,
      contributionFrequency,
      managementFee: managementFee !== undefined ? Number(managementFee) : undefined,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error simulating OPCVM investment:', error);
    res.status(500).json({ error: 'Failed to simulate investment' });
  }
};
