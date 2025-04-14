export interface ExperienceLevel {
  name: string;
  baseRate: number;
}

export interface ProjectType {
  name: string;
  multiplier: number;
  profitMargin: number;
}

export interface ScheduleType {
  name: string;
  multiplier: number;
}

export interface Config {
  experienceLevels: ExperienceLevel[];
  projectTypes: ProjectType[];
  scheduleTypes: ScheduleType[];
  indirectCostPerMonth: number;
  billableHoursPerMonth: number;
  taxRate: number;
  isDefault: boolean;
}

export interface FormData {
  experienceLevel: string;
  projectType: string;
  scheduleType: string;
  customIndirectCost: number | null;
  customBillableHours: number | null;
}

export interface ResultCalculation {
  baseRate: number;
  projectMultiplier: number;
  scheduleMultiplier: number;
  indirectCostPerMonth: number;
  billableHoursPerMonth: number;
  indirectCostPerHour: number;
  profitMargin: number;
  taxRate: number;
}

export interface ResultValues {
  adjustedBase: number;
  costBeforeMargin: number;
  costWithMargin: number;
  finalCost: number;
}

export interface CalculationResult {
  input: FormData;
  calculation: ResultCalculation;
  results: ResultValues;
}
