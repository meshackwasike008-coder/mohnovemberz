export interface SubKpiItem {
  id: string;
  name: string;
  weight?: number;
  target_2025_26: string;
  actual_2025_26: string;
  target_baseline_2026_27: string;
  target_2027_28: string;
  target_2028_29: string;
  target_2029_30: string;
}

export interface OutputItem {
  id: string;
  output_title: string;
  kpis: SubKpiItem[];
}

export interface DeliveryUnitItem {
  id: string;
  name: string;
  category?: string;
  outputs: OutputItem[];
}

export interface SubProgrammeItem {
  id: string;
  code: string;
  name: string;
  outcome?: string;
  delivery_units: DeliveryUnitItem[];
}

export interface ProgrammeItem {
  id: number;
  code: string;
  title: string;
  outcome: string;
  progress_pct: number;
  budget: number;
  budget_formatted?: string;
  lead_directorate?: string;
  sub_programmes: SubProgrammeItem[];
}

export const INITIAL_PROGRAMMES: ProgrammeItem[] = [
  {
    "id": 1,
    "code": "Programme 1",
    "title": "Programme 1: National Referral Facilities and Specialized Services",
    "outcome": "Increased access and range of quality specialized health care services",
    "progress_pct": 91.4,
    "budget": 34783532471,
    "lead_directorate": "Directorate of Health Infrastructure & Referral Facilities",
    "sub_programmes": [
      {
        "id": "sp-1-1",
        "code": "SP.1.1",
        "name": "SP.1.1 - National Referral Services",
        "outcome": "Enhanced tertiary referral capacity and specialized clinical interventions",
        "delivery_units": [
          {
            "id": "du-knh",
            "name": "1. KENYATTA NATIONAL HOSPITAL (KNH)",
            "category": "National Referral Hospital",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-jootrh",
            "name": "2. JARAMOGI OGINGA ODINGA TEACHING AND REFERRAL (JOOTRH)",
            "category": "National Referral Hospital",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-mntrh",
            "name": "3. MATHARI NATIONAL TEACHING AND REFERRAL HOSPITAL (MNTRH)",
            "category": "National Psychiatric Referral Hospital",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-kutrrh",
            "name": "4. KENYATTA UNIVERSITY TEACHING REFERRAL AND RESEARCH HOSPITAL (KUTRRH)",
            "category": "National Referral Hospital",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-mtrh",
            "name": "5. MOI TEACHING AND REFERAL HOSPITAL (MTRH)",
            "category": "National Referral Hospital",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-mkh",
            "name": "6. MWAI KIBAKI HOSPITAL (MKH)",
            "category": "National Referral Annex Hospital",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-1-2",
        "code": "SP.1.2",
        "name": "SP.1.2 - Health Infrastructure and Equipment",
        "outcome": "Upgraded medical infrastructure and advanced equipment availability",
        "delivery_units": [
          {
            "id": "du-sp12-knh",
            "name": "1. KENYATTA NATIONAL HOSPITAL (KNH)",
            "category": "Infrastructure Modernization",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-sp12-nesp",
            "name": "2. NATIONAL EQUIPMENT SUPPLY PROGRAMME (NESP)",
            "category": "Equipment Services",
            "outputs": [
              {
                "id": "out-nesp-1",
                "output_title": "a. Specialized health care services (Complex Medical Equipment)",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-nesp-2",
                "output_title": "b. Health Infrastructure and Maintenance Outreaches",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-1-3",
        "code": "SP.1.3",
        "name": "SP.1.3 - National Blood Transfusion Service",
        "outcome": "Adequate, safe and accessible blood and blood components nationwide",
        "delivery_units": [
          {
            "id": "du-sp13-knh",
            "name": "1. KENYATTA NATIONAL HOSPITAL (KNH)",
            "category": "Blood Bank & Transfusion Center",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-sp13-nbts",
            "name": "2. DIVISION OF NATIONAL BLOOD TRANSFUSION SERVICES (DNBTS)",
            "category": "National Coordination Agency",
            "outputs": [
              {
                "id": "out-nbts-1",
                "output_title": "a. Specialized Blood Collection and Quality Testing services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-nbts-2",
                "output_title": "b. Blood Donation Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-1-4",
        "code": "SP.1.4",
        "name": "SP.1.4 - Health Products and Technologies",
        "outcome": "Reliable availability of essential medical supplies and commodities",
        "delivery_units": [
          {
            "id": "du-sp14-knh",
            "name": "1. KENYATTA NATIONAL HOSPITAL (KNH)",
            "category": "Hospital Supply Chain & Technology",
            "outputs": [
              {
                "id": "out-a",
                "output_title": "a. Specialized health care services",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-b",
                "output_title": "b. Health Research disseminated",
                "kpis": [
                  {
                    "id": "kpi-b-1",
                    "name": "Number of new research projects disseminated",
                    "weight": 100,
                    "target_2025_26": "5",
                    "actual_2025_26": "3",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "8",
                    "target_2028_29": "9",
                    "target_2029_30": "9"
                  }
                ]
              },
              {
                "id": "out-c",
                "output_title": "c. Average waiting time for specialized diagnostic and treatment services reduced",
                "kpis": [
                  {
                    "id": "kpi-c-1",
                    "name": "Average Length of Stay (ALOS) for trauma patients (days)",
                    "weight": 35,
                    "target_2025_26": "35",
                    "actual_2025_26": "40.9",
                    "target_baseline_2026_27": "34.2",
                    "target_2027_28": "33.5",
                    "target_2028_29": "33.2",
                    "target_2029_30": "32.8"
                  },
                  {
                    "id": "kpi-c-2",
                    "name": "Average waiting time (days) for radiotherapy",
                    "weight": 35,
                    "target_2025_26": "17",
                    "actual_2025_26": "57",
                    "target_baseline_2026_27": "16.5",
                    "target_2027_28": "16",
                    "target_2028_29": "15.5",
                    "target_2029_30": "15"
                  },
                  {
                    "id": "kpi-c-3",
                    "name": "Average waiting time (days) for chemotherapy",
                    "weight": 30,
                    "target_2025_26": "3",
                    "actual_2025_26": "2.1",
                    "target_baseline_2026_27": "2",
                    "target_2027_28": "2",
                    "target_2028_29": "1.5",
                    "target_2029_30": "2"
                  }
                ]
              },
              {
                "id": "out-d",
                "output_title": "d. Multidisciplinary Outreaches Conducted",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-sp14-kemsa",
            "name": "2. KENYA MEDICAL SUPPLIES AUTHORITY (KEMSA)",
            "category": "Commodity Procurement & Distribution",
            "outputs": [
              {
                "id": "out-kemsa-1",
                "output_title": "a. Specialized Medical Commodities Supply and Distribution",
                "kpis": [
                  {
                    "id": "kpi-a-1",
                    "name": "Number of Heart surgeries done",
                    "weight": 15,
                    "target_2025_26": "784",
                    "actual_2025_26": "630",
                    "target_baseline_2026_27": "784",
                    "target_2027_28": "815",
                    "target_2028_29": "863",
                    "target_2029_30": "889"
                  },
                  {
                    "id": "kpi-a-2",
                    "name": "Number of other cardiothoracic surgeries conducted",
                    "weight": 15,
                    "target_2025_26": "1,519",
                    "actual_2025_26": "1,023",
                    "target_baseline_2026_27": "1,519",
                    "target_2027_28": "1,261",
                    "target_2028_29": "1,266",
                    "target_2029_30": "1,281"
                  },
                  {
                    "id": "kpi-a-3",
                    "name": "Number of Kidney Transplants conducted.",
                    "weight": 10,
                    "target_2025_26": "24",
                    "actual_2025_26": "22",
                    "target_baseline_2026_27": "24",
                    "target_2027_28": "29",
                    "target_2028_29": "31",
                    "target_2029_30": "32"
                  },
                  {
                    "id": "kpi-a-4",
                    "name": "Number of minimally invasive surgeries done",
                    "weight": 20,
                    "target_2025_26": "10,716",
                    "actual_2025_26": "9,852",
                    "target_baseline_2026_27": "10,784",
                    "target_2027_28": "11,539",
                    "target_2028_29": "11,986",
                    "target_2029_30": "12,346"
                  },
                  {
                    "id": "kpi-a-5",
                    "name": "Number of patients undergoing specialized Burns treatment (OBD)",
                    "weight": 15,
                    "target_2025_26": "649",
                    "actual_2025_26": "439",
                    "target_baseline_2026_27": "649",
                    "target_2027_28": "595",
                    "target_2028_29": "598",
                    "target_2029_30": "604"
                  },
                  {
                    "id": "kpi-a-6",
                    "name": "Number of oncology sessions on (Chemotherapy and radiotherapy)",
                    "weight": 25,
                    "target_2025_26": "47,646",
                    "actual_2025_26": "11,545",
                    "target_baseline_2026_27": "47,646",
                    "target_2027_28": "40,600",
                    "target_2028_29": "40,637",
                    "target_2029_30": "41,450"
                  }
                ]
              },
              {
                "id": "out-kemsa-2",
                "output_title": "b. Last Mile County Supply Outreaches",
                "kpis": [
                  {
                    "id": "kpi-d-1",
                    "name": "Number of Multi-disciplinary Outreaches with Counties",
                    "weight": 100,
                    "target_2025_26": "390",
                    "actual_2025_26": "376",
                    "target_baseline_2026_27": "421",
                    "target_2027_28": "428",
                    "target_2028_29": "431",
                    "target_2029_30": "440"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "budget_formatted": "KSH. 34,783,532,471"
  },
  {
    "id": 2,
    "code": "Programme 2",
    "title": "Programme 2: Curative and RMNCAH",
    "outcome": "Increased access to quality curative health care services",
    "progress_pct": 86.8,
    "budget": 42800000000,
    "lead_directorate": "Directorate of Family Health & Curative Services",
    "sub_programmes": [
      {
        "id": "sp-2-1",
        "code": "S.P 2.1",
        "name": "Sub programme 2.1: Communicable disease control",
        "outcome": "Management and reduction of transmission of HIV/AIDS, STI and communicable infections",
        "delivery_units": [
          {
            "id": "du-nsdcc",
            "name": "1. NATIONAL SYNDEMIC DISEASES CONTROL COUNCIL (NSDCC)",
            "category": "Council / Agency",
            "outputs": [
              {
                "id": "nsdcc-out-1",
                "output_title": "a. Management of HIV and AIDS",
                "kpis": [
                  {
                    "id": "nsdcc-kpi-1",
                    "name": "Proportion of new infection among adolescents and young people(10-24years)",
                    "weight": 25,
                    "target_2025_26": "26",
                    "actual_2025_26": "32",
                    "target_baseline_2026_27": "21",
                    "target_2027_28": "NA",
                    "target_2028_29": "NA",
                    "target_2029_30": "N/A"
                  },
                  {
                    "id": "nsdcc-kpi-2",
                    "name": "Number of condoms distributed in non-health settings",
                    "weight": 25,
                    "target_2025_26": "11,591,560",
                    "actual_2025_26": "2,421,074",
                    "target_baseline_2026_27": "2,517,517",
                    "target_2027_28": "2,618,634",
                    "target_2028_29": "2,723,379",
                    "target_2029_30": "2,832,314"
                  },
                  {
                    "id": "nsdcc-kpi-3",
                    "name": "Mother to child transmission Rate (MTCT)",
                    "weight": 25,
                    "target_2025_26": "5%",
                    "actual_2025_26": "8%",
                    "target_baseline_2026_27": "5%",
                    "target_2027_28": "5%",
                    "target_2028_29": "5%",
                    "target_2029_30": "5%"
                  },
                  {
                    "id": "nsdcc-kpi-4",
                    "name": "Proportion of Counties Visualizing real time HIV data via Situation Room",
                    "weight": 25,
                    "target_2025_26": "100%",
                    "actual_2025_26": "100%",
                    "target_baseline_2026_27": "100%",
                    "target_2027_28": "100%",
                    "target_2028_29": "100%",
                    "target_2029_30": "100%"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-nascop",
            "name": "2. NATIONAL AIDS AND STI CONTROL PROGRAM (NASCOP)",
            "category": "Programme",
            "outputs": [
              {
                "id": "nascop-out-1",
                "output_title": "a. HIV Treatment & Viral Load Suppression Services",
                "kpis": [
                  {
                    "id": "nascop-kpi-1",
                    "name": "Number of people Currently on ART",
                    "weight": 60,
                    "target_2025_26": "1,325,522",
                    "actual_2025_26": "1,325,522",
                    "target_baseline_2026_27": "1,350,000",
                    "target_2027_28": "1,380,000",
                    "target_2028_29": "1,410,000",
                    "target_2029_30": "1,450,000"
                  },
                  {
                    "id": "nascop-kpi-2",
                    "name": "Percentage of Newly identified HIV positive and Breastfeeding women initiated on highly active Antiretroviral Therapy",
                    "weight": 40,
                    "target_2025_26": "100%",
                    "actual_2025_26": "87.4%",
                    "target_baseline_2026_27": "90%",
                    "target_2027_28": "95%",
                    "target_2028_29": "98%",
                    "target_2029_30": "100%"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-2-2",
        "code": "S.P 2.2",
        "name": "Sub programme 2.2: Non-communicable diseases prevention and control",
        "outcome": "Screening, early detection, and management of cancer, diabetes, and cardiovascular diseases",
        "delivery_units": [
          {
            "id": "du-ncik",
            "name": "1. NATIONAL CANCER INSTITUTE KENYA (NCI-K)",
            "category": "Institute",
            "outputs": [
              {
                "id": "nci-out-1",
                "output_title": "a. Cancer Prevention and Control Services",
                "kpis": [
                  {
                    "id": "nci-kpi-1",
                    "name": "Number of public Awareness Campaigns Conducted on Cancers, modifiable risk factors, HPV vaccination",
                    "weight": 30,
                    "target_2025_26": "35",
                    "actual_2025_26": "18",
                    "target_baseline_2026_27": "20",
                    "target_2027_28": "22",
                    "target_2028_29": "24",
                    "target_2029_30": "26"
                  },
                  {
                    "id": "nci-kpi-2",
                    "name": "Number of Regional cancers centers established",
                    "weight": 35,
                    "target_2025_26": "1",
                    "actual_2025_26": "0",
                    "target_baseline_2026_27": "0",
                    "target_2027_28": "2",
                    "target_2028_29": "3",
                    "target_2029_30": "3"
                  },
                  {
                    "id": "nci-kpi-3",
                    "name": "Number of cancer registry hubs established",
                    "weight": 35,
                    "target_2025_26": "12",
                    "actual_2025_26": "12",
                    "target_baseline_2026_27": "13",
                    "target_2027_28": "13",
                    "target_2028_29": "14",
                    "target_2029_30": "14"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-nccp",
            "name": "2. NATIONAL CANCER CONTROL PROGRAMME",
            "category": "Programme",
            "outputs": [
              {
                "id": "nccp-out-1",
                "output_title": "a. Cancer Screening and Precancerous Lesion Treatment",
                "kpis": [
                  {
                    "id": "nccp-kpi-1",
                    "name": "Proportion of women (25-49 years) screened for cervical cancer",
                    "weight": 50,
                    "target_2025_26": "50%",
                    "actual_2025_26": "44%",
                    "target_baseline_2026_27": "55%",
                    "target_2027_28": "60%",
                    "target_2028_29": "65%",
                    "target_2029_30": "80%"
                  },
                  {
                    "id": "nccp-kpi-2",
                    "name": "Proportion of women with precancerous lesions receiving treatment",
                    "weight": 50,
                    "target_2025_26": "50%",
                    "actual_2025_26": "50%",
                    "target_baseline_2026_27": "60%",
                    "target_2027_28": "70%",
                    "target_2028_29": "80%",
                    "target_2029_30": "90%"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-ncd",
            "name": "3. NON-COMMUNICABLE DISEASES (NCD) PREVENTION AND CONTROL UNIT",
            "category": "Unit",
            "outputs": [
              {
                "id": "ncd-out-1",
                "output_title": "a. NCD Prevention, Diabetes, and Sickle Cell Disease management",
                "kpis": [
                  {
                    "id": "ncd-kpi-1",
                    "name": "Number of newly diagnosed diabetes cases",
                    "weight": 50,
                    "target_2025_26": "29,000",
                    "actual_2025_26": "26,998",
                    "target_baseline_2026_27": "29,000",
                    "target_2027_28": "29,000",
                    "target_2028_29": "32,500",
                    "target_2029_30": "35,000"
                  },
                  {
                    "id": "ncd-kpi-2",
                    "name": "Number of infants screened for Sickle Cell Disease (SCD)",
                    "weight": 50,
                    "target_2025_26": "2,000",
                    "actual_2025_26": "2,400",
                    "target_baseline_2026_27": "4,000",
                    "target_2027_28": "20,000",
                    "target_2028_29": "30,000",
                    "target_2029_30": "40,000"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-2-3",
        "code": "S.P 2.3",
        "name": "Sub programme 2.3: Reproductive Maternal Neonatal Child and Adolescent Health",
        "outcome": "Reduction of maternal and infant mortality rates through comprehensive primary and emergency care",
        "delivery_units": [
          {
            "id": "du-famhealth",
            "name": "1. DEPARTMENT OF FAMILY HEALTH",
            "category": "Department",
            "outputs": [
              {
                "id": "fam-out-1",
                "output_title": "a. Maternal Neonatal and Child Health Services",
                "kpis": [
                  {
                    "id": "fam-kpi-1",
                    "name": "Facility based maternal mortality rate per 100,000 deliveries",
                    "weight": 35,
                    "target_2025_26": "97",
                    "actual_2025_26": "94.72",
                    "target_baseline_2026_27": "90",
                    "target_2027_28": "80",
                    "target_2028_29": "75",
                    "target_2029_30": "70"
                  },
                  {
                    "id": "fam-kpi-2",
                    "name": "Under five mortality rates per 1,000 live births",
                    "weight": 35,
                    "target_2025_26": "25",
                    "actual_2025_26": "41",
                    "target_baseline_2026_27": "35",
                    "target_2027_28": "30",
                    "target_2028_29": "28",
                    "target_2029_30": "25"
                  },
                  {
                    "id": "fam-kpi-3",
                    "name": "Proportion of children under age 5 developmental milestones on track in health, learning, and psychosocial wellbeing",
                    "weight": 30,
                    "target_2025_26": "100%",
                    "actual_2025_26": "78%",
                    "target_baseline_2026_27": "80%",
                    "target_2027_28": "80%",
                    "target_2028_29": "85%",
                    "target_2029_30": "90%"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-2-4",
        "code": "S.P 2.4",
        "name": "Sub programme 2.4: Immunization Management",
        "outcome": "Universal immunization coverage and functional vaccine cold-chain security",
        "delivery_units": [
          {
            "id": "du-nvip",
            "name": "1. DIVISION OF NATIONAL VACCINES AND IMMUNIZATION PROGRAM",
            "category": "Division",
            "outputs": [
              {
                "id": "nvip-out-1",
                "output_title": "a. Vaccines and Immunization Services",
                "kpis": [
                  {
                    "id": "nvip-kpi-1",
                    "name": "Proportion of fully immunized children under 1year (Proxy Penta 3)",
                    "weight": 50,
                    "target_2025_26": "82%",
                    "actual_2025_26": "80%",
                    "target_baseline_2026_27": "82%",
                    "target_2027_28": "84%",
                    "target_2028_29": "86%",
                    "target_2029_30": "90%"
                  },
                  {
                    "id": "nvip-kpi-2",
                    "name": "Proportion of Health Facilities with Functional Cold Chain Equipment",
                    "weight": 50,
                    "target_2025_26": "92%",
                    "actual_2025_26": "93%",
                    "target_baseline_2026_27": "94%",
                    "target_2027_28": "95%",
                    "target_2028_29": "95%",
                    "target_2029_30": "96%"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-2-5",
        "code": "S.P 2.5",
        "name": "Sub programme 2.5: Curative Services",
        "outcome": "Strengthened clinical specialties, diagnostic standards, and assistive technologies",
        "delivery_units": [
          {
            "id": "du-ortho",
            "name": "1. ORTHOPEDICS AND TRAUMA UNIT",
            "category": "Unit",
            "outputs": [
              {
                "id": "ortho-out-1",
                "output_title": "a. Orthopedic Trauma and Technology Services",
                "kpis": [
                  {
                    "id": "ortho-kpi-1",
                    "name": "Proportion of Orthopedic Trauma Technologist and Technician regulations",
                    "weight": 50,
                    "target_2025_26": "100%",
                    "actual_2025_26": "75%",
                    "target_baseline_2026_27": "80%",
                    "target_2027_28": "80%",
                    "target_2028_29": "80%",
                    "target_2029_30": "80%"
                  },
                  {
                    "id": "ortho-kpi-2",
                    "name": "Proportion of National facilities providing orthopedic & trauma services supervised (%)",
                    "weight": 50,
                    "target_2025_26": "100%",
                    "actual_2025_26": "100%",
                    "target_baseline_2026_27": "20%",
                    "target_2027_28": "20%",
                    "target_2028_29": "30%",
                    "target_2029_30": "50%"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-ophthalmic",
            "name": "2. OPHTHALMIC SERVICES",
            "category": "Specialized Unit",
            "outputs": [
              {
                "id": "oph-out-1",
                "output_title": "a. Expanding specialized eye care services",
                "kpis": [
                  {
                    "id": "oph-kpi-1",
                    "name": "Number of New Diabetic eye care centers established in 10 facilities",
                    "weight": 50,
                    "target_2025_26": "9",
                    "actual_2025_26": "9",
                    "target_baseline_2026_27": "10",
                    "target_2027_28": "0",
                    "target_2028_29": "5",
                    "target_2029_30": "5"
                  },
                  {
                    "id": "oph-kpi-2",
                    "name": "Number of Centers offering Refractive Low Vision Services",
                    "weight": 50,
                    "target_2025_26": "15",
                    "actual_2025_26": "10",
                    "target_baseline_2026_27": "10",
                    "target_2027_28": "9",
                    "target_2028_29": "12",
                    "target_2029_30": "15"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "budget_formatted": "KSH. 42,800,000,000"
  },
  {
    "id": 3,
    "code": "Programme 3",
    "title": "Programme 3: Health Research and Innovations",
    "outcome": "Increased Health Research, Digitization, and Vaccine Manufacturing Innovations",
    "progress_pct": 83.2,
    "budget": 18600000000,
    "lead_directorate": "Directorate of Digital Health, Research & Innovations",
    "sub_programmes": [
      {
        "id": "sp-3-1",
        "code": "S.P 3.1",
        "name": "Sub programme 3.1: Health Innovations",
        "outcome": "Nationwide digital health transformation and local biopharmaceutical manufacturing",
        "delivery_units": [
          {
            "id": "du-dha",
            "name": "1. DIGITAL HEALTH AGENCY (DHA)",
            "category": "Semi-Autonomous Agency",
            "outputs": [
              {
                "id": "dha-out-1",
                "output_title": "a. Taifa Care HMIS Digitization across Levels 2 to 6",
                "kpis": [
                  {
                    "id": "dha-kpi-1",
                    "name": "Percentage of Level 2-4 Health Facilities digitalized through Taifa Care HMIS",
                    "weight": 25,
                    "target_2025_26": "50%",
                    "actual_2025_26": "82.3%",
                    "target_baseline_2026_27": "100%",
                    "target_2027_28": "100%",
                    "target_2028_29": "100%",
                    "target_2029_30": "100%"
                  },
                  {
                    "id": "dha-kpi-2",
                    "name": "Percentage of Level 5 and 6 Health Facilities digitalized through Taifa Care HMIS initiative",
                    "weight": 25,
                    "target_2025_26": "20%",
                    "actual_2025_26": "3%",
                    "target_baseline_2026_27": "60%",
                    "target_2027_28": "100%",
                    "target_2028_29": "100%",
                    "target_2029_30": "100%"
                  },
                  {
                    "id": "dha-kpi-3",
                    "name": "Number of end user devices dispatched to health facilities for digital health transformation",
                    "weight": 25,
                    "target_2025_26": "40,000",
                    "actual_2025_26": "27,154",
                    "target_baseline_2026_27": "20,000",
                    "target_2027_28": "10,000",
                    "target_2028_29": "10,000",
                    "target_2029_30": "10,000"
                  },
                  {
                    "id": "dha-kpi-4",
                    "name": "Number of Dashboards and Analytics to Promote Data Use Developed",
                    "weight": 25,
                    "target_2025_26": "3",
                    "actual_2025_26": "80",
                    "target_baseline_2026_27": "80",
                    "target_2027_28": "120",
                    "target_2028_29": "150",
                    "target_2029_30": "150"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-biovax",
            "name": "2. KENYA BIOVAX INSTITUTE",
            "category": "State Corporation",
            "outputs": [
              {
                "id": "bio-out-1",
                "output_title": "a. Human vaccines and biologics local production facility",
                "kpis": [
                  {
                    "id": "bio-kpi-1",
                    "name": "Percentage completion rate of human vaccine fill-and-finish facility Phase 1B (GMP consultancy, clean rooms & QC Labs)",
                    "weight": 50,
                    "target_2025_26": "40%",
                    "actual_2025_26": "25%",
                    "target_baseline_2026_27": "60%",
                    "target_2027_28": "80%",
                    "target_2028_29": "100%",
                    "target_2029_30": "N/A"
                  },
                  {
                    "id": "bio-kpi-2",
                    "name": "Percentage completion rate of the Aseptic Fill and Finish vaccines manufacturing facility Phase 1C",
                    "weight": 50,
                    "target_2025_26": "N/A",
                    "actual_2025_26": "N/A",
                    "target_baseline_2026_27": "20%",
                    "target_2027_28": "30%",
                    "target_2028_29": "60%",
                    "target_2029_30": "100%"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-3-2",
        "code": "S.P 3.2",
        "name": "Sub programme 3.2: Medical Research",
        "outcome": "Scientific evidence generation, diagnostic innovation, and commercialized health prototypes",
        "delivery_units": [
          {
            "id": "du-kemri",
            "name": "1. KENYA MEDICAL RESEARCH INSTITUTE (KEMRI)",
            "category": "Research SAGA",
            "outputs": [
              {
                "id": "kemri-out-1",
                "output_title": "a. Human Health Research services & Specialized Diagnostic Testing",
                "kpis": [
                  {
                    "id": "kemri-kpi-1",
                    "name": "Number of Research Papers published",
                    "weight": 30,
                    "target_2025_26": "550",
                    "actual_2025_26": "665",
                    "target_baseline_2026_27": "665",
                    "target_2027_28": "670",
                    "target_2028_29": "680",
                    "target_2029_30": "690"
                  },
                  {
                    "id": "kemri-kpi-2",
                    "name": "Number of Evidence/Policy Briefs developed",
                    "weight": 30,
                    "target_2025_26": "6",
                    "actual_2025_26": "9",
                    "target_baseline_2026_27": "10",
                    "target_2027_28": "12",
                    "target_2028_29": "14",
                    "target_2029_30": "16"
                  },
                  {
                    "id": "kemri-kpi-3",
                    "name": "Number of Specialized Laboratory Tests undertaken",
                    "weight": 40,
                    "target_2025_26": "1,100,000",
                    "actual_2025_26": "433,309",
                    "target_baseline_2026_27": "450,000",
                    "target_2027_28": "544,000",
                    "target_2028_29": "598,450",
                    "target_2029_30": "658,295"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "budget_formatted": "KSH. 18,600,000,000"
  },
  {
    "id": 4,
    "code": "Programme 4",
    "title": "Programme 4: General Administration, Planning and Support Services",
    "outcome": "Strengthen Governance, Leadership, and Social Health Financing in the State Department",
    "progress_pct": 92.5,
    "budget": 26200000000,
    "lead_directorate": "Directorate of Planning & Administration",
    "sub_programmes": [
      {
        "id": "sp-4-1",
        "code": "S.P 4.1",
        "name": "Sub programme 4.1: General Administration",
        "outcome": "Support services coordination, ICT modernization, and human capital excellence",
        "delivery_units": [
          {
            "id": "du-genadmin",
            "name": "1. GENERAL ADMINISTRATION SERVICES",
            "category": "Directorate",
            "outputs": [
              {
                "id": "adm-out-1",
                "output_title": "a. Coordination of support services & Citizen Charter compliance",
                "kpis": [
                  {
                    "id": "adm-kpi-1",
                    "name": "Number of workplace policies developed and implemented",
                    "weight": 35,
                    "target_2025_26": "5",
                    "actual_2025_26": "5",
                    "target_baseline_2026_27": "5",
                    "target_2027_28": "5",
                    "target_2028_29": "5",
                    "target_2029_30": "5"
                  },
                  {
                    "id": "adm-kpi-2",
                    "name": "Proportion of complaints addressed within 21 days from lodge",
                    "weight": 35,
                    "target_2025_26": "N/A",
                    "actual_2025_26": "100%",
                    "target_baseline_2026_27": "100%",
                    "target_2027_28": "100%",
                    "target_2028_29": "100%",
                    "target_2029_30": "100%"
                  },
                  {
                    "id": "adm-kpi-3",
                    "name": "Productivity index",
                    "weight": 30,
                    "target_2025_26": "N/A",
                    "actual_2025_26": "80%",
                    "target_baseline_2026_27": "80%",
                    "target_2027_28": "90%",
                    "target_2028_29": "100%",
                    "target_2029_30": "100%"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-ict",
            "name": "2. ICT SERVICES",
            "category": "Division",
            "outputs": [
              {
                "id": "ict-out-1",
                "output_title": "a. ICT networking and equipment provided",
                "kpis": [
                  {
                    "id": "ict-kpi-1",
                    "name": "Ratio of staff to functional computers/laptops",
                    "weight": 50,
                    "target_2025_26": "2:1",
                    "actual_2025_26": "1:1",
                    "target_baseline_2026_27": "1:1",
                    "target_2027_28": "1:1",
                    "target_2028_29": "1:1",
                    "target_2029_30": "1:1"
                  },
                  {
                    "id": "ict-kpi-2",
                    "name": "Proportion of institutions with functional LAN and WAN",
                    "weight": 50,
                    "target_2025_26": "50%",
                    "actual_2025_26": "50%",
                    "target_baseline_2026_27": "75%",
                    "target_2027_28": "100%",
                    "target_2028_29": "100%",
                    "target_2029_30": "100%"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-4-2",
        "code": "S.P 4.2",
        "name": "Sub programme 4.2: Financing, Planning, Monitoring and Evaluation",
        "outcome": "Program-based budget tracking, capital project oversight, and county M&E capacity",
        "delivery_units": [
          {
            "id": "du-finance",
            "name": "1. FINANCE DIVISION",
            "category": "Division",
            "outputs": [
              {
                "id": "fin-out-1",
                "output_title": "a. Coordination of budget preparation and reporting",
                "kpis": [
                  {
                    "id": "fin-kpi-1",
                    "name": "Number of Quarterly Budget Reports prepared and submitted",
                    "weight": 50,
                    "target_2025_26": "4",
                    "actual_2025_26": "4",
                    "target_baseline_2026_27": "4",
                    "target_2027_28": "4",
                    "target_2028_29": "4",
                    "target_2029_30": "4"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-planning",
            "name": "2. CENTRAL PLANNING & PROJECTS MONITORING UNIT",
            "category": "Unit",
            "outputs": [
              {
                "id": "plan-out-1",
                "output_title": "a. Coordination of national development & capital monitoring",
                "kpis": [
                  {
                    "id": "plan-kpi-1",
                    "name": "Number of reports for capital projects monitored for progress",
                    "weight": 50,
                    "target_2025_26": "4",
                    "actual_2025_26": "4",
                    "target_baseline_2026_27": "4",
                    "target_2027_28": "4",
                    "target_2028_29": "4",
                    "target_2029_30": "4"
                  },
                  {
                    "id": "plan-kpi-2",
                    "name": "Number of Counties trained on planning, budgeting and M & E",
                    "weight": 50,
                    "target_2025_26": "47",
                    "actual_2025_26": "47",
                    "target_baseline_2026_27": "47",
                    "target_2027_28": "47",
                    "target_2028_29": "47",
                    "target_2029_30": "47"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "sp-4-3",
        "code": "S.P 4.3",
        "name": "Sub programme 4.3: Social Protection in Health",
        "outcome": "Universal health coverage entitlement, financial risk protection, and SHA beneficiary expansion",
        "delivery_units": [
          {
            "id": "du-hcf",
            "name": "1. DIVISION OF HEALTH-CARE FINANCING",
            "category": "Division",
            "outputs": [
              {
                "id": "hcf-out-1",
                "output_title": "a. Resource mobilization & pooling for UHC",
                "kpis": [
                  {
                    "id": "hcf-kpi-1",
                    "name": "Percentage of government budget allocated to health (Abuja target: 15%)",
                    "weight": 35,
                    "target_2025_26": "13.5%",
                    "actual_2025_26": "6.7%",
                    "target_baseline_2026_27": "13.8%",
                    "target_2027_28": "14.2%",
                    "target_2028_29": "14.5%",
                    "target_2029_30": "15%"
                  },
                  {
                    "id": "hcf-kpi-2",
                    "name": "Percentage of population enrolled in health insurance of any kind (KHFS target: 85%)",
                    "weight": 35,
                    "target_2025_26": "60%",
                    "actual_2025_26": "38%",
                    "target_baseline_2026_27": "66%",
                    "target_2027_28": "71%",
                    "target_2028_29": "77%",
                    "target_2029_30": "82%"
                  },
                  {
                    "id": "hcf-kpi-3",
                    "name": "Percentage of population incurring catastrophic health expenditure (target: 2%)",
                    "weight": 30,
                    "target_2025_26": "5%",
                    "actual_2025_26": "7.1%",
                    "target_baseline_2026_27": "4.3%",
                    "target_2027_28": "3.7%",
                    "target_2028_29": "3%",
                    "target_2029_30": "2.3%"
                  }
                ]
              }
            ]
          },
          {
            "id": "du-sha",
            "name": "2. SOCIAL HEALTH AUTHORITY (SHA)",
            "category": "Authority / SAGA",
            "outputs": [
              {
                "id": "sha-out-1",
                "output_title": "a. Beneficiary enrolment to UHC increased",
                "kpis": [
                  {
                    "id": "sha-kpi-1",
                    "name": "Number of New Registered beneficiaries on Social Health Authority (SHA)",
                    "weight": 100,
                    "target_2025_26": "8,200,200",
                    "actual_2025_26": "8,643,484",
                    "target_baseline_2026_27": "8,400,000",
                    "target_2027_28": "4,520,000",
                    "target_2028_29": "2,200,000",
                    "target_2029_30": "1,000,000"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "budget_formatted": "KSH. 26,200,000,000"
  }
];
