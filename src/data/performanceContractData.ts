export interface PcDetailKpiItem {
  id: string;
  kpi_name: string;
  baseline: string;
  target_2025_26: string;
  actual_2025_26: string;
  target_baseline_2026_27: string;
  target_2027_28: string;
  target_2028_29: string;
  target_2029_30: string;
  weight?: number;
  current_achievement?: number;
  q1_score?: number;
  q2_score?: number;
  q3_score?: number;
  q4_score?: number;
  status?: 'Approved' | 'Reviewed' | 'Submitted' | 'Draft';
  variance_comment?: string;
}

export interface PcOutputItem {
  id: string;
  output_title: string;
  kpis: PcDetailKpiItem[];
}

export interface PcSubKpiItem {
  id: string;
  code: string;
  name: string;
  weight: number;
  delivery_unit: string;
  programme_id: number;
  programme_name: string;
  sub_programme_id: string;
  sub_programme_name: string;
  status: 'Approved' | 'Reviewed' | 'Submitted' | 'Draft';
  variance_comment?: string;
  outputs: PcOutputItem[];
}

export type CategoryType = 
  | 'Financial Stewardship' 
  | 'Service Delivery' 
  | 'Core Mandate' 
  | 'Implementation of Presidential Directives' 
  | 'Affirmative Action in Procurement' 
  | 'Cross-Cutting';

export interface PcMainKpiItem {
  id: string;
  code: string;
  title: string;
  category: CategoryType;
  weight: number; // A:10, B:15, C:65, D:2, E:4, F:4
  description: string;
  target_score: number;
  current_achievement: number;
  status: 'Approved' | 'Reviewed' | 'Submitted' | 'Draft';
  financial_year: string;
  sub_kpis: PcSubKpiItem[];
}

export interface VarianceResult {
  value: number;
  formatted: string;
  percentFormatted: string;
  status: 'positive' | 'negative' | 'neutral';
}

export function calculateVariance(targetStr: string, actualStr: string): VarianceResult {
  if (!targetStr && !actualStr) {
    return { value: 0, formatted: '-', percentFormatted: '-', status: 'neutral' };
  }
  const parseVal = (str: string): number => {
    if (!str) return NaN;
    const cleaned = str.replace(/,/g, '').trim();
    const match = cleaned.match(/[-+]?[0-9]*\.?[0-9]+/);
    return match ? parseFloat(match[0]) : NaN;
  };
  const targetNum = parseVal(targetStr);
  const actualNum = parseVal(actualStr);
  if (isNaN(targetNum) || isNaN(actualNum)) {
    return { value: 0, formatted: '-', percentFormatted: '-', status: 'neutral' };
  }
  const diff = actualNum - targetNum;
  const isPercent = targetStr.includes('%') || actualStr.includes('%');
  const sign = diff > 0 ? '+' : '';
  const formatted = isPercent ? `${sign}${diff.toFixed(1)}%` : `${sign}${diff >= 1000 || diff <= -1000 ? diff.toLocaleString() : diff.toFixed(diff % 1 === 0 ? 0 : 1)}`;
  let percentFormatted = targetNum !== 0 && !isPercent ? `${sign}${((diff / targetNum) * 100).toFixed(1)}%` : formatted;
  return {
    value: diff,
    formatted,
    percentFormatted,
    status: diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral'
  };
}

export const INITIAL_MAIN_KPIS: PcMainKpiItem[] = [
  {
    id: 'main-kpi-a',
    code: 'KPI A',
    title: 'Financial Stewardship & Fiscal Discipline',
    category: 'Financial Stewardship',
    weight: 10,
    description: '100% absorption of exchequer releases, A-in-A optimization, grant drawdown, and clearance of historical pending bills.',
    target_score: 100,
    current_achievement: 95.8,
    status: 'Approved',
    financial_year: '2026/2027',
    sub_kpis: [
      {
        id: 'sub-kpi-a1',
        code: 'A1',
        name: 'Absorption of Allocated Funds (GoK & Development)',
        weight: 3.0,
        delivery_unit: 'Directorate of Finance & Accounts',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-1',
        sub_programme_name: 'SP 4.1: General Administration Services',
        status: 'Approved',
        variance_comment: 'GoK exchequer releases received on schedule; development votes absorption accelerated.',
        outputs: [
          {
            id: 'out-a1-1',
            output_title: '100% absorption of exchequer releases for GoK development & recurrent votes',
            kpis: [
              { id: 'k1', kpi_name: 'Exchequer Recurrent Vote absorption rate (%)', baseline: '96.5%', target_2025_26: '100%', actual_2025_26: '97.2%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 1.5, current_achievement: 97.2, q1_score: 96, q2_score: 97, q3_score: 98, q4_score: 98, status: 'Approved' },
              { id: 'k2', kpi_name: 'Exchequer Development Vote absorption rate (%)', baseline: '92.0%', target_2025_26: '100%', actual_2025_26: '94.8%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 1.5, current_achievement: 94.8, q1_score: 92, q2_score: 94, q3_score: 96, q4_score: 97, status: 'Approved' }
            ]
          }
        ]
      },
      {
        id: 'sub-kpi-a2',
        code: 'A2',
        name: 'Appropriation-In-Aid (A-in-A) Collection & Absorption',
        weight: 3.0,
        delivery_unit: 'Kenyatta National Hospital (KNH)',
        programme_id: 1,
        programme_name: 'Programme 1: National Referral Facilities and Specialized Services',
        sub_programme_id: 'sp-1-1',
        sub_programme_name: 'S.P 1.1 National Referral & Specialized Health Services',
        status: 'Approved',
        variance_comment: 'Revenue streams automated through digital payment gateway integration with e-Citizen.',
        outputs: [
          {
            id: 'out-a2-1',
            output_title: 'Internal revenue collection generated and absorbed in line with PFM Act',
            kpis: [
              { id: 'k3', kpi_name: 'A-in-A Revenue collection target attainment rate (%)', baseline: '94.5%', target_2025_26: '100%', actual_2025_26: '95.6%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 3.0, current_achievement: 95.6, q1_score: 93, q2_score: 95, q3_score: 96.5, q4_score: 98, status: 'Approved' }
            ]
          }
        ]
      },
      {
        id: 'sub-kpi-a3',
        code: 'A3',
        name: 'Pending Bills Ratio & Historical Debt Settlement',
        weight: 4.0,
        delivery_unit: 'Finance & Accounts, Procurement Division',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-2',
        sub_programme_name: 'SP4.2: Financing, Planning, Monitoring and Evaluation',
        status: 'Approved',
        variance_comment: 'Clearance rate of verified supplier bills prioritized under quarterly exchequer allocations.',
        outputs: [
          {
            id: 'out-a3-1',
            output_title: 'Progressive reduction and clearance of eligible verified supplier & contractor pending bills',
            kpis: [
              { id: 'k4', kpi_name: 'Settlement rate of verified and audited supplier pending bills (%)', baseline: '95.0%', target_2025_26: '100%', actual_2025_26: '98.4%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 4.0, current_achievement: 98.4, q1_score: 96, q2_score: 98, q3_score: 99, q4_score: 100, status: 'Approved' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'main-kpi-b',
    code: 'KPI B',
    title: 'Service Delivery & Citizen Charter Compliance',
    category: 'Service Delivery',
    weight: 15,
    description: 'Adherence to published service delivery standards, triage turnaround time, public complaint resolution, and Ombudsman satisfaction ratings.',
    target_score: 100,
    current_achievement: 96.2,
    status: 'Approved',
    financial_year: '2026/2027',
    sub_kpis: [
      {
        id: 'sub-kpi-b1',
        code: 'B1',
        name: 'Implementation of Citizens\' Service Delivery Charter',
        weight: 8.0,
        delivery_unit: 'Directorate of Public Communications & Customer Relations',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-1',
        sub_programme_name: 'SP 4.1: General Administration Services',
        status: 'Approved',
        variance_comment: 'Digital queuing and customer feedback touchpoints deployed in all national referral hospitals.',
        outputs: [
          {
            id: 'out-b1-1',
            output_title: '100% compliance with Citizens\' Service Delivery Charter standards across referral units',
            kpis: [
              { id: 'k5', kpi_name: 'Citizen Service Charter overall compliance index (%)', baseline: '90.0%', target_2025_26: '100%', actual_2025_26: '95.5%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 4.0, current_achievement: 95.5, q1_score: 92, q2_score: 95, q3_score: 96, q4_score: 98, status: 'Approved' },
              { id: 'k6', kpi_name: 'Average outpatient triage turnaround time compliance (<= 45 mins) (%)', baseline: '85.0%', target_2025_26: '95%', actual_2025_26: '93.2%', target_baseline_2026_27: '98%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 4.0, current_achievement: 93.2, q1_score: 90, q2_score: 92, q3_score: 94, q4_score: 96, status: 'Approved' }
            ]
          }
        ]
      },
      {
        id: 'sub-kpi-b2',
        code: 'B2',
        name: 'Resolution of Public Complaints via CAJ Ombudsman Mechanism',
        weight: 7.0,
        delivery_unit: 'Ministerial Complaints Redress Committee',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-1',
        sub_programme_name: 'SP 4.1: General Administration Services',
        status: 'Approved',
        variance_comment: 'All public inquiries resolved within the 7-day statutory Ombudsman window.',
        outputs: [
          {
            id: 'out-b2-1',
            output_title: 'Prompt and comprehensive resolution of public grievances and CAJ Ombudsman inquiries',
            kpis: [
              { id: 'k7', kpi_name: 'Resolution rate of lodged public complaints within statutory timeline (%)', baseline: '95.0%', target_2025_26: '100%', actual_2025_26: '98.0%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 7.0, current_achievement: 98.0, q1_score: 96, q2_score: 98, q3_score: 98, q4_score: 100, status: 'Approved' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'main-kpi-c',
    code: 'KPI C',
    title: 'Core Mandate & Flagship Priorities (Surgeries, UHC, PCNs & HPT)',
    category: 'Core Mandate',
    weight: 65,
    description: 'Core ministerial deliverables from PROJECT-DATA.pdf: Specialized surgeries at KNH, MTRH, KUTRRH, Mathari, Primary Care Networks, KEMSA supply chain, and Social Health Authority registrations.',
    target_score: 100,
    current_achievement: 92.4,
    status: 'Approved',
    financial_year: '2026/2027',
    sub_kpis: [
      {
        id: 'sub-kpi-c1',
        code: 'C1.1',
        name: 'Specialized Healthcare Services & Tertiary Interventions (KNH)',
        weight: 25.0,
        delivery_unit: 'Kenyatta National Hospital (KNH)',
        programme_id: 1,
        programme_name: 'Programme 1: National Referral Facilities and Specialized Services',
        sub_programme_id: 'sp-1-1',
        sub_programme_name: 'S.P 1.1 National Referral & Specialized Health Services',
        status: 'Approved',
        variance_comment: 'Heart surgeries, cardiothoracic operations, and organ transplants executed as per PROJECT-DATA.pdf targets.',
        outputs: [
          {
            id: 'out-c1-1',
            output_title: 'Specialized health care services',
            kpis: [
              { id: 'k8', kpi_name: 'Number of Heart surgeries done', baseline: '784', target_2025_26: '784', actual_2025_26: '630', target_baseline_2026_27: '784', target_2027_28: '815', target_2028_29: '863', target_2029_30: '889', weight: 5.0, current_achievement: 80.3, q1_score: 75, q2_score: 80, q3_score: 82, q4_score: 80.3, status: 'Approved' },
              { id: 'k9', kpi_name: 'Number of other cardiothoracic surgeries conducted', baseline: '1,519', target_2025_26: '1,519', actual_2025_26: '1,023', target_baseline_2026_27: '1,519', target_2027_28: '1,261', target_2028_29: '1,266', target_2029_30: '1,281', weight: 5.0, current_achievement: 67.3, q1_score: 65, q2_score: 67, q3_score: 68, q4_score: 67.3, status: 'Approved' },
              { id: 'k10', kpi_name: 'Number of Kidney Transplants conducted', baseline: '24', target_2025_26: '24', actual_2025_26: '22', target_baseline_2026_27: '24', target_2027_28: '29', target_2028_29: '31', target_2029_30: '32', weight: 5.0, current_achievement: 91.6, q1_score: 85, q2_score: 90, q3_score: 92, q4_score: 91.6, status: 'Approved' },
              { id: 'k11', kpi_name: 'Number of minimally invasive surgeries done', baseline: '10,716', target_2025_26: '10,716', actual_2025_26: '9,852', target_baseline_2026_27: '10,784', target_2027_28: '11,539', target_2028_29: '11,986', target_2029_30: '12,346', weight: 5.0, current_achievement: 91.9, q1_score: 90, q2_score: 91, q3_score: 92, q4_score: 91.9, status: 'Approved' },
              { id: 'k12', kpi_name: 'Number of oncology sessions (Chemotherapy and radiotherapy)', baseline: '47,646', target_2025_26: '47,646', actual_2025_26: '11,545', target_baseline_2026_27: '47,646', target_2027_28: '40,600', target_2028_29: '40,637', target_2029_30: '41,450', weight: 5.0, current_achievement: 24.2, q1_score: 22, q2_score: 24, q3_score: 25, q4_score: 24.2, status: 'Approved' }
            ]
          }
        ]
      },
      {
        id: 'sub-kpi-c2',
        code: 'C2.1',
        name: 'Specialized Tertiary & Oncology Services (MTRH)',
        weight: 15.0,
        delivery_unit: 'Moi Teaching and Referral Hospital (MTRH)',
        programme_id: 1,
        programme_name: 'Programme 1: National Referral Facilities and Specialized Services',
        sub_programme_id: 'sp-1-1',
        sub_programme_name: 'S.P 1.1 National Referral & Specialized Health Services',
        status: 'Approved',
        variance_comment: 'Oncology patient treatment sessions and kidney transplants tracking successfully.',
        outputs: [
          {
            id: 'out-c2-1',
            output_title: 'Specialized Healthcare Services at MTRH',
            kpis: [
              { id: 'k13', kpi_name: 'Number of oncology patients receiving chemotherapy treatment', baseline: '3,653', target_2025_26: '3,653', actual_2025_26: '2,976', target_baseline_2026_27: '3,512', target_2027_28: '4,180', target_2028_29: '4,598', target_2029_30: '5,057', weight: 5.0, current_achievement: 81.4, q1_score: 78, q2_score: 80, q3_score: 82, q4_score: 81.4, status: 'Approved' },
              { id: 'k14', kpi_name: 'Number of Kidney Transplants undertaken at MTRH', baseline: '18', target_2025_26: '18', actual_2025_26: '20', target_baseline_2026_27: '20', target_2027_28: '21', target_2028_29: '22', target_2029_30: '23', weight: 5.0, current_achievement: 100, q1_score: 95, q2_score: 100, q3_score: 100, q4_score: 100, status: 'Approved' },
              { id: 'k15', kpi_name: 'Number of Minimally Invasive Surgeries at MTRH', baseline: '3,100', target_2025_26: '3,100', actual_2025_26: '3,318', target_baseline_2026_27: '3,300', target_2027_28: '3,350', target_2028_29: '3,400', target_2029_30: '3,450', weight: 5.0, current_achievement: 100, q1_score: 95, q2_score: 100, q3_score: 100, q4_score: 100, status: 'Approved' }
            ]
          }
        ]
      },
      {
        id: 'sub-kpi-c3',
        code: 'C3.1',
        name: 'Primary Care Networks & Community Health Interventions',
        weight: 12.5,
        delivery_unit: 'Primary Healthcare Directorate & County Health Networks',
        programme_id: 2,
        programme_name: 'Programme 2: Curative and RMNCAH',
        sub_programme_id: 'sp-2-1',
        sub_programme_name: 'SP 2.1 Communicable disease control',
        status: 'Approved',
        variance_comment: 'Primary Care Networks and community health promoter digital kits deployed.',
        outputs: [
          {
            id: 'out-c3-1',
            output_title: 'Operationalized Primary Care Networks (PCNs) & CHPs',
            kpis: [
              { id: 'k16', kpi_name: 'Community health promoters equipped with e-CHIS electronic kits', baseline: '100,000', target_2025_26: '105,000', actual_2025_26: '107,832', target_baseline_2026_27: '110,000', target_2027_28: '112,000', target_2028_29: '115,000', target_2029_30: '115,000', weight: 6.25, current_achievement: 100, q1_score: 95, q2_score: 98, q3_score: 100, q4_score: 100, status: 'Approved' },
              { id: 'k17', kpi_name: 'Primary healthcare facility essential drug availability index (%)', baseline: '85.0%', target_2025_26: '90.0%', actual_2025_26: '91.5%', target_baseline_2026_27: '93.0%', target_2027_28: '95.0%', target_2028_29: '96.0%', target_2029_30: '98.0%', weight: 6.25, current_achievement: 91.5, q1_score: 88, q2_score: 90, q3_score: 92, q4_score: 94, status: 'Approved' }
            ]
          }
        ]
      },
      {
        id: 'sub-kpi-c4',
        code: 'C4.1',
        name: 'Health Products, Technologies & KEMSA Supply Chain',
        weight: 12.5,
        delivery_unit: 'Kenya Medical Supplies Authority (KEMSA)',
        programme_id: 1,
        programme_name: 'Programme 1: National Referral Facilities and Specialized Services',
        sub_programme_id: 'sp-1-2',
        sub_programme_name: 'SP 1.2 Health Infrastructure and Equipment',
        status: 'Approved',
        variance_comment: 'Order refill rate and turnaround times optimized across 47 county depots.',
        outputs: [
          {
            id: 'out-c4-1',
            output_title: 'Improved Stock Availability of Health Products & technologies',
            kpis: [
              { id: 'k18', kpi_name: 'Percentage order refill rate for HPTs (%)', baseline: '90.0%', target_2025_26: '90.0%', actual_2025_26: '86.0%', target_baseline_2026_27: '90.0%', target_2027_28: '90.0%', target_2028_29: '95.0%', target_2029_30: '95.0%', weight: 6.25, current_achievement: 95.5, q1_score: 90, q2_score: 92, q3_score: 94, q4_score: 95.5, status: 'Approved' },
              { id: 'k19', kpi_name: 'Order turnaround time (days) for Hospitals', baseline: '7 days', target_2025_26: '7 days', actual_2025_26: '18 days', target_baseline_2026_27: '7 days', target_2027_28: '7 days', target_2028_29: '7 days', target_2029_30: '7 days', weight: 6.25, current_achievement: 88.0, q1_score: 82, q2_score: 85, q3_score: 87, q4_score: 88, status: 'Approved' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'main-kpi-d',
    code: 'KPI D',
    title: 'Implementation of Presidential Directives & Cabinet Resolutions',
    category: 'Implementation of Presidential Directives',
    weight: 2,
    description: '100% tracking and execution of executive health sector directives and presidential priority pronouncements.',
    target_score: 100,
    current_achievement: 94.0,
    status: 'Approved',
    financial_year: '2026/2027',
    sub_kpis: [
      {
        id: 'sub-kpi-d1',
        code: 'D1',
        name: 'Executive Directives & Cabinet Resolution Tracking',
        weight: 2.0,
        delivery_unit: 'Office of the Cabinet Secretary & Policy Delivery Unit',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-1',
        sub_programme_name: 'SP 4.1: General Administration Services',
        status: 'Approved',
        variance_comment: 'Weekly monitoring cadence established for all presidential health initiatives.',
        outputs: [
          {
            id: 'out-d1-1',
            output_title: '100% tracking and execution of executive health sector directives',
            kpis: [
              { id: 'k20', kpi_name: 'Presidential & Cabinet directive resolution and execution index (%)', baseline: '90.0%', target_2025_26: '100%', actual_2025_26: '94.0%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 2.0, current_achievement: 94.0, q1_score: 90, q2_score: 94, q3_score: 96, q4_score: 98, status: 'Approved' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'main-kpi-e',
    code: 'KPI E',
    title: 'Affirmative Action in Procurement (AGPO & Local Manufacturing)',
    category: 'Affirmative Action in Procurement',
    weight: 4,
    description: 'Access to Government Procurement Opportunities (AGPO) for Youth, Women, and Persons with Disabilities (PWDs), plus local manufacturing preferences.',
    target_score: 100,
    current_achievement: 93.5,
    status: 'Approved',
    financial_year: '2026/2027',
    sub_kpis: [
      {
        id: 'sub-kpi-e1',
        code: 'E1',
        name: 'AGPO Allocation & Preferential Procurement for Local HPT',
        weight: 4.0,
        delivery_unit: 'Procurement & Supply Chain Directorate',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-1',
        sub_programme_name: 'SP 4.1: General Administration Services',
        status: 'Approved',
        variance_comment: 'AGPO quotas fully met; preferential procurement list adopted across health agencies.',
        outputs: [
          {
            id: 'out-e1-1',
            output_title: 'AGPO and preferential local manufacturing procurement quotas achieved',
            kpis: [
              { id: 'k21', kpi_name: 'Proportion of procurement budget allocated to Youth, Women & PWDs (AGPO) (%)', baseline: '30.0%', target_2025_26: '30.0%', actual_2025_26: '31.2%', target_baseline_2026_27: '30.0%', target_2027_28: '30.0%', target_2028_29: '30.0%', target_2029_30: '30.0%', weight: 2.0, current_achievement: 100, q1_score: 30, q2_score: 31, q3_score: 31.2, q4_score: 31.2, status: 'Approved' },
              { id: 'k22', kpi_name: 'Percentage of health procuring entities adopting local manufacturing HPT list (%)', baseline: 'N/A', target_2025_26: '50.0%', actual_2025_26: '50.0%', target_baseline_2026_27: '75.0%', target_2027_28: '100.0%', target_2028_29: '100.0%', target_2029_30: '100.0%', weight: 2.0, current_achievement: 100, q1_score: 45, q2_score: 50, q3_score: 55, q4_score: 60, status: 'Approved' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'main-kpi-f',
    code: 'KPI F',
    title: 'Cross-Cutting & Institutional Strengthening',
    category: 'Cross-Cutting',
    weight: 4,
    description: 'National values, ethics, asset declarations, environmental bio-safety compliance, and ICT digital transformation.',
    target_score: 100,
    current_achievement: 95.2,
    status: 'Approved',
    financial_year: '2026/2027',
    sub_kpis: [
      {
        id: 'sub-kpi-f1',
        code: 'F1',
        name: 'National Values, Ethics & Environmental Bio-safety Compliance',
        weight: 4.0,
        delivery_unit: 'Health Human Resource Management & Bio-safety Division',
        programme_id: 4,
        programme_name: 'Programme 4: General Administration, Planning and Support Services',
        sub_programme_id: 'sp-4-1',
        sub_programme_name: 'SP 4.1: General Administration Services',
        status: 'Approved',
        variance_comment: 'Bio-medical waste disposal and asset declaration compliance successfully achieved.',
        outputs: [
          {
            id: 'out-f1-1',
            output_title: 'Institutional governance, ethics and environmental bio-safety standards',
            kpis: [
              { id: 'k23', kpi_name: 'Staff asset declaration and integrity compliance rate (%)', baseline: '92.0%', target_2025_26: '100%', actual_2025_26: '95.0%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 2.0, current_achievement: 95.0, q1_score: 92, q2_score: 95, q3_score: 96, q4_score: 98, status: 'Approved' },
              { id: 'k24', kpi_name: 'Bio-medical clinical waste disposal and facility safety audit index (%)', baseline: '88.0%', target_2025_26: '100%', actual_2025_26: '91.5%', target_baseline_2026_27: '100%', target_2027_28: '100%', target_2028_29: '100%', target_2029_30: '100%', weight: 2.0, current_achievement: 91.5, q1_score: 88, q2_score: 91, q3_score: 94, q4_score: 96, status: 'Approved' }
            ]
          }
        ]
      }
    ]
  }
];
