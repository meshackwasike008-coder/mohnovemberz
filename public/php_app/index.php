<?php
require_once 'db.php';

$active_tab = $_GET['tab'] ?? 'dashboard';

$projects = [];
$flagships = [];
$kpis = [];
try {
    if (isset($pdo)) {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY id ASC");
        $projects = $stmt->fetchAll();

        $stmt = $pdo->query("SELECT * FROM flagships ORDER BY id ASC");
        $flagships = $stmt->fetchAll();

        $stmt = $pdo->query("SELECT * FROM performance_kpis ORDER BY id ASC");
        $kpis = $stmt->fetchAll();
    }
} catch (Exception $e) {
    $db_error = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ministry of Health - PP-SDOMS (Standalone PHP)</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f4f7fb; color: #1e293b; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col">
    <!-- Top Header Bar -->
    <header class="bg-[#0d47a1] text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="bg-white/10 p-2 rounded-xl border border-white/20">
                    <span class="text-xl font-black tracking-tight">MOH</span>
                </div>
                <div>
                    <div class="text-[10px] font-bold text-blue-200 tracking-widest uppercase">Republic of Kenya — Ministry of Health</div>
                    <h1 class="text-lg font-extrabold tracking-tight">Project Performance &amp; Operational Management System (PP-SDOMS)</h1>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <div class="bg-white/15 px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold">
                    Dr. Harry Kimtai <span class="text-blue-200 text-[10px] block font-normal">Principal Secretary - SDMS</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="bg-white border-b border-slate-200 shadow-2xs">
        <div class="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto">
            <a href="?tab=dashboard" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'dashboard' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Dashboard</a>
            <a href="?tab=flagships" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'flagships' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Priority Flagships</a>
            <a href="?tab=projects" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'projects' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Projects &amp; Programmes</a>
            <a href="?tab=kpis" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'kpis' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Performance Contracts</a>
            <a href="?tab=diary" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'diary' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Official Diary</a>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        <?php if (isset($db_error)): ?>
            <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs text-amber-800 font-medium">
                Database Note: <?= htmlspecialchars($db_error); ?> (Please import <code>schema.sql</code> via phpMyAdmin).
            </div>
        <?php endif; ?>

        <?php if ($active_tab === 'dashboard'): ?>
            <!-- Dashboard Overview -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div class="text-[11px] font-bold uppercase text-slate-400">Total Projects</div>
                        <div class="text-2xl font-black text-slate-900 mt-1"><?= count($projects); ?></div>
                        <div class="text-xs text-emerald-600 font-bold mt-1">100% On Track</div>
                    </div>
                    <div class="p-3 bg-blue-50 text-blue-700 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div class="text-[11px] font-bold uppercase text-slate-400">Priority Flagships</div>
                        <div class="text-2xl font-black text-slate-900 mt-1"><?= count($flagships); ?></div>
                        <div class="text-xs text-blue-600 font-bold mt-1">Critical UHC Initiatives</div>
                    </div>
                    <div class="p-3 bg-indigo-50 text-indigo-700 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div class="text-[11px] font-bold uppercase text-slate-400">Performance KPIs</div>
                        <div class="text-2xl font-black text-slate-900 mt-1"><?= count($kpis); ?> Categories</div>
                        <div class="text-xs text-emerald-600 font-bold mt-1">Total Weight: 100%</div>
                    </div>
                    <div class="p-3 bg-emerald-50 text-emerald-700 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div class="text-[11px] font-bold uppercase text-slate-400">System Status</div>
                        <div class="text-2xl font-black text-emerald-600 mt-1">Online</div>
                        <div class="text-xs text-slate-500 font-medium mt-1">Standalone PHP / MySQL</div>
                    </div>
                    <div class="p-3 bg-sky-50 text-sky-700 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg></div>
                </div>
            </div>

            <!-- Welcome Banner -->
            <div class="bg-[#0d47a1] text-white p-8 rounded-2xl shadow-md space-y-3">
                <span class="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">State Department for Medical Services</span>
                <h2 class="text-2xl font-black">Project Performance, Service Delivery &amp; Operational Management System</h2>
                <p class="text-xs text-blue-100 max-w-3xl leading-relaxed">
                    This standalone PHP application runs natively on cPanel with Apache and MySQL without requiring any Node.js runtime. Use the top navigation tabs to manage priority flagships, inspect project portfolios, track monthly progress with weighted KPI contribution categories (A–F), and coordinate official diaries.
                </p>
            </div>

        <?php elseif ($active_tab === 'flagships'): ?>
            <!-- Priority Flagships -->
            <div class="space-y-4">
                <h2 class="text-lg font-black text-slate-900">Priority Flagships (UHC &amp; Specialized Infrastructure)</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <?php foreach ($flagships as $f): ?>
                        <div class="bg-white rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-[#0d47a1] p-5 space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase"><?= htmlspecialchars($f['priority_tier']); ?></span>
                                <span class="text-xs font-bold text-slate-500">Due: <?= htmlspecialchars($f['target_date']); ?></span>
                            </div>
                            <h3 class="font-extrabold text-base text-slate-900"><?= htmlspecialchars($f['title']); ?></h3>
                            <p class="text-xs text-slate-600"><?= htmlspecialchars($f['description']); ?></p>
                            <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                                <span class="font-bold text-blue-700">Progress: <?= $f['progress_pct']; ?>%</span>
                                <span class="text-slate-500 font-medium">Lead: <?= htmlspecialchars($f['lead_officer']); ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

        <?php elseif ($active_tab === 'projects'): ?>
            <!-- Projects Portfolio -->
            <div class="space-y-4">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                    <h2 class="text-base font-black text-slate-900">All Priority Projects &amp; Programmes</h2>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                            <tr>
                                <th class="py-3 px-4">Programme &amp; Sub-Programme</th>
                                <th class="py-3 px-3">Category</th>
                                <th class="py-3 px-3">Status</th>
                                <th class="py-3 px-3 text-right">Budget (KES)</th>
                                <th class="py-3 px-4">Progress</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($projects as $pr): ?>
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-4">
                                        <div class="font-extrabold text-slate-900"><?= htmlspecialchars($pr['sub_programme']); ?></div>
                                        <div class="text-[11px] text-slate-500"><?= htmlspecialchars($pr['programme_title']); ?></div>
                                    </td>
                                    <td class="py-3 px-3 font-semibold text-slate-700"><?= htmlspecialchars($pr['category']); ?></td>
                                    <td class="py-3 px-3">
                                        <span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]"><?= htmlspecialchars($pr['status']); ?></span>
                                    </td>
                                    <td class="py-3 px-3 text-right font-mono font-bold text-slate-900"><?= number_format($pr['total_budget'], 2); ?></td>
                                    <td class="py-3 px-4">
                                        <div class="font-bold text-blue-700 mb-1"><?= htmlspecialchars($pr['progress_status']); ?></div>
                                        <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div class="bg-[#40B5AD] h-full rounded-full" style="width: 85%;"></div>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($active_tab === 'kpis'): ?>
            <!-- Performance KPIs Contract & Gantt at the bottom -->
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-slate-900 via-[#0a2356] to-blue-950 text-white rounded-xl p-5 shadow-sm border border-slate-800">
                    <div class="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <span class="bg-blue-600/60 px-2 py-0.5 rounded text-[11px] font-bold font-mono">21st / 22nd Performance Cycle</span>
                            <h2 class="text-xl font-black mt-1 text-white tracking-tight">Performance Contract Monitoring Matrix &amp; Progress Calculator</h2>
                            <p class="text-xs text-slate-300 max-w-2xl mt-1">Hierarchical KPIs and Sub-KPIs weighted at 100% total contribution across 6 result areas (Categories A–F).</p>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-center min-w-[190px]">
                            <div class="text-[10px] uppercase font-bold tracking-wider text-blue-200">Overall Ministerial Score</div>
                            <div class="text-3xl font-black text-yellow-300 font-mono mt-0.5">91.5%</div>
                            <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">All Targets On Track</div>
                        </div>
                    </div>
                </div>

                <h2 class="text-lg font-black text-slate-900">Performance Contract KPI Matrix (2026/2027) — Total Weight: 100%</h2>
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                            <tr>
                                <th class="py-3 px-4">Code &amp; Category</th>
                                <th class="py-3 px-3">Weight</th>
                                <th class="py-3 px-3">Indicator / KPI Name</th>
                                <th class="py-3 px-3">Delivery Unit</th>
                                <th class="py-3 px-3 text-center">Achievement</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($kpis as $kp): ?>
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-4">
                                        <span class="font-mono font-bold text-blue-700"><?= htmlspecialchars($kp['code']); ?></span>
                                        <div class="font-bold text-slate-800"><?= htmlspecialchars($kp['category']); ?></div>
                                    </td>
                                    <td class="py-3 px-3 font-mono font-bold"><?= $kp['category_weight']; ?>%</td>
                                    <td class="py-3 px-3 font-medium text-slate-800"><?= htmlspecialchars($kp['kpi_name']); ?></td>
                                    <td class="py-3 px-3 text-slate-600"><?= htmlspecialchars($kp['delivery_unit']); ?></td>
                                    <td class="py-3 px-3 text-center">
                                        <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded"><?= $kp['current_achievement']; ?>%</span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Overall Project Progress by Month — KPI Contribution Gantt Chart -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h3 class="text-sm font-black text-slate-900 border-b border-slate-200 pb-3">Overall Project Progress by Month — KPI Contribution</h3>
                    <div class="space-y-3">
                        <?php 
                        $months = ['Aug 2026', 'Jul 2026', 'Jun 2026', 'May 2026', 'Apr 2026', 'Mar 2026'];
                        $totals = [41.3, 40.9, 40.5, 40.0, 39.5, 39.0];
                        foreach($months as $idx => $m):
                            $tot = $totals[$idx];
                        ?>
                        <div class="grid grid-cols-12 items-center gap-2 text-xs">
                            <div class="col-span-2 font-mono font-bold text-slate-700 text-right pr-2"><?= $m; ?></div>
                            <div class="col-span-10 flex items-center gap-2">
                                <div class="flex-1 bg-slate-100 h-6 rounded overflow-hidden flex border border-slate-200">
                                    <div class="bg-[#1976d2] h-full" style="width: <?= $tot * 0.10 * 2.2; ?>%" title="A - Financial Stewardship (10%)"></div>
                                    <div class="bg-[#f97316] h-full" style="width: <?= $tot * 0.15 * 2.2; ?>%" title="B - Service Delivery (15%)"></div>
                                    <div class="bg-[#40B5AD] h-full" style="width: <?= $tot * 0.65 * 2.2; ?>%" title="C - Core Mandate (65%)"></div>
                                    <div class="bg-[#8b5cf6] h-full" style="width: <?= $tot * 0.02 * 2.2; ?>%" title="D - Presidential Directives (2%)"></div>
                                    <div class="bg-[#ec4899] h-full" style="width: <?= $tot * 0.04 * 2.2; ?>%" title="E - Affirmative Action (4%)"></div>
                                    <div class="bg-[#6b7280] h-full" style="width: <?= $tot * 0.04 * 2.2; ?>%" title="F - Cross-Cutting (4%)"></div>
                                </div>
                                <span class="font-mono font-bold w-12"><?= $tot; ?>%</span>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <!-- Legend -->
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-[11px]">
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#1976d2]"></span><span>A - Financial Stewardship (10%)</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#f97316]"></span><span>B - Service Delivery (15%)</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#40B5AD]"></span><span>C - Core Mandate (65%)</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#8b5cf6]"></span><span>D - Presidential Directives (2%)</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#ec4899]"></span><span>E - Affirmative Action (4%)</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#6b7280]"></span><span>F - Cross-Cutting (4%)</span></div>
                    </div>
                </div>
            </div>

        <?php elseif ($active_tab === 'diary'): ?>
            <!-- Official Diary -->
            <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 class="text-lg font-black text-slate-900">Official Ministerial Diary &amp; Executive Schedule</h2>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-900">
                    <span class="font-bold">Instructions:</span> Click on category badges on any calendar date to view executive meetings, commissioning ceremonies, and high-level stakeholder briefs.
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                        <span class="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded">Event</span>
                        <h4 class="font-bold text-slate-900 text-sm">Commissioning of KNH Modern Burns ICU</h4>
                        <p class="text-xs text-slate-600">February 15, 2026 at 09:30 AM — Kenyatta National Hospital</p>
                    </div>
                    <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                        <span class="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">Meeting</span>
                        <h4 class="font-bold text-slate-900 text-sm">UHC Intergovernmental Health Summit</h4>
                        <p class="text-xs text-slate-600">February 20, 2026 at 10:00 AM — Afya House Boardroom</p>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white py-6 mt-12 text-xs">
        <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
            <div>
                <div class="font-black">State Department for Medical Services — PP-SDOMS</div>
                <div class="text-slate-400 mt-0.5">Standalone PHP / MySQL Version (cPanel Ready)</div>
            </div>
            <div class="text-slate-400">Republic of Kenya &copy; 2026 Ministry of Health</div>
        </div>
    </footer>
</body>
</html>
