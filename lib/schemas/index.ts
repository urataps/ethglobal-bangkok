import { type LucideIcon } from 'lucide-react';
import { Key } from 'react';
import { z } from 'zod';

export enum InvestmentRiskLevel {
  LOW = 'Low Risk',
  AVERAGE = 'Average Risk',
  MEDIUM = 'Medium Risk',
  HIGH = 'Hight Risk',
  Degen = 'Degen Risk',
}

export type InvestmentInfo = {
  icon: LucideIcon;
  name?: string;
  value: number | string | Date | undefined;
};

export type InvestmentsPlanProps = {
  isGrid?: boolean;
  strategyData: InvestmentPlanHeaderCardProps | InvestmentPlanHeaderCardProps[];
  transformedInvestments: {
    strategyId?: string;
    investments: Investment[];
  }[];
};

export type Investment = {
  [x: string]: Key | null | undefined;
  protocol: string;
  chain: string;
  pool: string;
  usdValue: number;
  apr: number | null;
  risk: InvestmentRiskLevel;
  img?: string;
  currency?: string;
};

export type InvestmentPlanHeaderCardProps = {
  id: string;
  aiRisk: number;
  generatedDate: string;
  title: string;
  estimatedPnL: number;
  estimatePnl: number;
  averageAPR: number;
  isFavorit: boolean;
  isActiv?: boolean;
  investmentInfo: {
    icon: LucideIcon | string;
    name: string;
    value: string | number;
  }[];
};

export type InvestmentPlanCardProps = {
  investment: Investment[];
};

export type InvestmentPlanMainCardProps = InvestmentPlanCardProps & {
  onRemove?: (index: number) => void;
  isEditing?: boolean;
  transformedInvestments: {
    strategyId?: string;
    investments: Investment[];
  }[];
};

export type ActiveStrategy = {
  id: string;
  name: string;
  description: string;
  investments: {
    protocol: string;
    chain: string;
    pool: string;
    usdValue: number;
    apr: number;
    risk: InvestmentRiskLevel;
    img: string;
    currency: string;
  }[];
};

export type PortofolioTableProps = {
  activeStrategies: ActiveStrategy[];
};

export interface APIInvestment {
  id: string;
  strategyId: string;
  chain: string;
  protocol: string;
  pool: string;
  APR: number | null;
  amount: number;
}

export interface APIStrategy {
  id: string;
  userId: string;
  createdAt: string;
  isFavorite: boolean;
  isActive: boolean;
  generationPrompt: string;
  investments: APIInvestment[];
}

export const investmentInfoSchema = z.object({
  icon: z.any(),
  name: z.string().optional(),
  value: z.union([z.number(), z.string(), z.date(), z.undefined()]),
});
export enum FarmCategories {
  ARTIFICIAL_INTELLIGENCE = 'Artificial Intelligence',
  R_W_A = 'RWA',
  DE_PIN = 'DePin',
  BORROWING_LENDING = 'Borrowing/Lending',
  STABLE_COINS = 'Stable Coins',
  MEME_FINANCE = 'Meme Finance',
  RESTAKING_PROTOCOLS = 'Restaking Protocols',
}

export const investmentSchema = z.object({
  protocol: z.string(),
  chain: z.string(),
  pool: z.string(),
  usdValue: z.number().positive(),
  apr: z.number().nullable(),
  risk: z.nativeEnum(InvestmentRiskLevel),
});

export const investmentPlanHeaderSchema = z.object({
  aiRisk: z.number().min(0).max(100),
  generatedDate: z.string(),
  title: z.string(),
  estimatedPnL: z.number(),
  averageAPR: z.number(),
  investmentInfo: z.array(investmentInfoSchema),
});

export const investmentPlanSchema = z.object({
  investment: z.array(investmentSchema),
});
