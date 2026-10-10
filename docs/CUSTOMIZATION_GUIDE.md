# State Department for Medical Services - PP-SDOMS
## System Customization Guide: Adding New Tables, Filters, and Graphs

This guide provides step-by-step instructions for system administrators and developers to extend the Ministry of Health Project Performance, Service Delivery & Operational Management System (PP-SDOMS) by adding new database tables, multi-select filters, and advanced performance charts or Gantt graphs.

---

### 1. Adding New Database Tables

To add a new table (e.g., `county_health_allocations` for tracking county-level fund disbursements):

1. **Update MySQL Database Schema (`/public/database/schema.sql`)**:
   Add your CREATE TABLE statement:
   ```sql
   CREATE TABLE county_health_allocations (
     id INT AUTO_INCREMENT PRIMARY KEY,
     county_name VARCHAR(100) NOT NULL,
     financial_year VARCHAR(50) NOT NULL,
     allocated_amount DECIMAL(15,2) DEFAULT 0.00,
     disbursed_amount DECIMAL(15,2) DEFAULT 0.00,
     status VARCHAR(50) DEFAULT 'Active',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```
   Execute this script in your cPanel phpMyAdmin console.

2. **Update TypeScript Types (`/src/data/initialData.ts`)**:
   Define the corresponding TypeScript interface:
   ```typescript
   export interface CountyAllocation {
     id: number;
     county_name: string;
     financial_year: string;
     allocated_amount: number;
     disbursed_amount: number;
     status: string;
   }
   ```
   Add initial state mock data in `initialData.ts` to power client-side views.

---

### 2. Adding New Filters (Single & Multiple Selection)

To add multi-select filters (e.g., filtering projects by multiple counties or priority tiers):

1. **Add State Variables in `src/App.tsx`**:
   ```typescript
   const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
   ```

2. **Create Multi-Select Filter UI Component**:
   ```tsx
   <div className="space-y-1">
     <label className="text-[10px] font-bold text-slate-500 uppercase block">Filter by Counties (Multi-Select)</label>
     <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
       {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map(county => {
         const isSelected = selectedCounties.includes(county);
         return (
           <button
             key={county}
             onClick={() => {
               setSelectedCounties(prev => 
                 isSelected ? prev.filter(c => c !== county) : [...prev, county]
               );
             }}
             className={`px-2.5 py-1 rounded text-xs font-bold transition ${
               isSelected ? 'bg-blue-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
             }`}
           >
             {county} {isSelected && '✓'}
           </button>
         );
       })}
     </div>
   </div>
   ```

3. **Add "Reset Filters" Button**:
   ```tsx
   <button
     onClick={() => {
       setSelectedCounties([]);
       setDashSearch('');
       setDashStatusFilter('All');
       showToast('Filters reset successfully.');
     }}
     className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg transition"
   >
     Reset Filters
   </button>
   ```

---

### 3. Adding New Graphs & Stacked Gantt Charts

To add custom SVG or CSS-based horizontal Gantt charts or category contribution charts:

1. **Define Data Array for Categories (A to F)**:
   ```typescript
   const kpiCategories = [
     { code: 'A', name: 'Financial Stewardship', weight: 10, color: 'bg-blue-600' },
     { code: 'B', name: 'Service Delivery', weight: 15, color: 'bg-emerald-600' },
     { code: 'C', name: 'Core Mandate', weight: 65, color: 'bg-amber-500' },
     { code: 'D', name: 'Presidential Directives', weight: 2, color: 'bg-indigo-600' },
     { code: 'E', name: 'Affirmative Action', weight: 4, color: 'bg-pink-600' },
     { code: 'F', name: 'Cross-Cutting', weight: 4, color: 'bg-purple-600' }
   ];
   ```

2. **Render Stacked Horizontal Bar / Gantt Chart in React**:
   ```tsx
   <div className="space-y-3">
     <h4 className="text-xs font-bold uppercase text-slate-700">Overall Project Progress by Month (Weighted KPI Contribution)</h4>
     <div className="space-y-2">
       {[
         { month: 'Jun 2026', total: 79.5, breakdown: [8, 12, 51.5, 2, 3, 3] },
         { month: 'May 2026', total: 65.4, breakdown: [7, 10, 42.4, 2, 2, 2] }
       ].map((row, idx) => (
         <div key={idx} className="flex items-center gap-3 text-xs">
           <span className="w-20 font-bold font-mono text-slate-700">{row.month}</span>
           <div className="flex-1 bg-slate-100 h-6 rounded-md overflow-hidden flex border border-slate-200 shadow-inner">
             {row.breakdown.map((val, i) => (
               <div
                 key={i}
                 className={`${kpiCategories[i].color} h-full flex items-center justify-center text-[10px] text-white font-bold transition-all`}
                 style={{ width: `${val * 1.2}%` }}
                 title={`${kpiCategories[i].name}: ${val}% contribution`}
               >
                 {val > 4 ? `${kpiCategories[i].code}` : ''}
               </div>
             ))}
           </div>
           <span className="w-14 font-mono font-black text-slate-900 text-right">{row.total}%</span>
         </div>
       ))}
     </div>
   </div>
   ```

---
*State Department for Medical Services — PP-SDOMS System Architecture & Maintenance Unit.*
