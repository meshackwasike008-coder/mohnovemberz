<?php
/** pc.php — Performance Contract matrix + Add Record */
global $pdo;

$contracts = [];
$kpis = [];
if ($pdo) {
    $contracts = $pdo->query('SELECT * FROM performance_contracts ORDER BY id ASC')->fetchAll();
    $kpis = $pdo->query('SELECT * FROM performance_kpis ORDER BY id ASC')->fetchAll();
}

$totalWeight = 0;
foreach ($contracts as $c) { $totalWeight += (float)$c['category_weight']; }
$avgAchievement = 0;
if ($contracts) {
    $sum = 0;
    foreach ($contracts as $c) { $sum += (float)$c['current_achievement']; }
    $avgAchievement = round($sum / count($contracts), 1);
}
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Performance Contracts</h2>
        <p class="text-xs text-slate-500 mt-0.5">21st / 22nd performance cycle — weighted KPI matrix (Categories A–F).</p>
    </div>
    <?php if (can('can_edit')): ?>
        <button class="btn btn-primary" data-open-modal="pcAddModal">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            Add Record
        </button>
    <?php endif; ?>
</div>

<div class="bg-gradient-to-r from-slate-900 via-[#0a2356] to-blue-950 text-white rounded-xl p-5">
    <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
            <span class="bg-blue-600/60 px-2 py-0.5 rounded text-[11px] font-bold font-mono">21st / 22nd Performance Cycle</span>
            <h2 class="text-lg font-black mt-1">Performance Contract Monitoring Matrix</h2>
            <p class="text-xs text-slate-300 mt-1">Hierarchical KPIs and sub-KPIs weighted at 100% total contribution across 6 result areas.</p>
        </div>
        <div class="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center min-w-[180px]">
            <div class="text-[10px] uppercase font-bold tracking-wider text-blue-200">Average Achievement</div>
            <div class="text-3xl font-black text-yellow-300 font-mono mt-0.5"><?= h($avgAchievement) ?>%</div>
            <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">Total weight: <?= h($totalWeight) ?>%</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 class="section-title">Performance Contract KPI Matrix</h3>
        <span class="text-[11px] text-slate-500"><?= count($contracts) ?> records</span>
    </div>
    <div class="table-wrap">
        <table class="data">
            <thead>
                <tr>
                    <th>Code &amp; Category</th>
                    <th>Weight</th>
                    <th>Indicator / KPI Name</th>
                    <th>Delivery Unit</th>
                    <th>Target</th>
                    <th class="text-center">Achievement</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($contracts as $c): ?>
                <tr>
                    <td>
                        <span class="font-mono font-bold text-blue-700"><?= h($c['code']) ?></span>
                        <div class="font-bold text-slate-800 text-[11px]"><?= h($c['category']) ?></div>
                    </td>
                    <td class="num"><?= h((float)$c['category_weight']) ?>%</td>
                    <td class="font-medium text-slate-800"><?= h($c['kpi_name']) ?></td>
                    <td class="text-slate-600"><?= h($c['delivery_unit']) ?></td>
                    <td class="text-slate-600"><?= h($c['target_baseline_2026_27']) ?></td>
                    <td class="text-center">
                        <span class="badge bg-emerald-100 text-emerald-800"><?= (int)$c['current_achievement'] ?>%</span>
                    </td>
                    <td><span class="badge <?= h(status_badge($c['status'])) ?>"><?= h($c['status']) ?></span></td>
                </tr>
            <?php endforeach; ?>
            <?php if (!$contracts): ?><tr><td colspan="7" class="text-center text-slate-400 py-6">No performance contract records yet.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php if ($kpis): ?>
<div class="card">
    <div class="px-4 py-3 border-b border-slate-100">
        <h3 class="section-title">Sub-KPI breakdown (used for project progress)</h3>
    </div>
    <div class="table-wrap">
        <table class="data">
            <thead><tr><th>Code</th><th>Category</th><th>Sub-KPI</th><th>Sub-weight</th><th class="text-center">Achievement</th></tr></thead>
            <tbody>
            <?php foreach ($kpis as $k): ?>
                <tr>
                    <td class="font-mono font-bold text-blue-700"><?= h($k['code']) ?></td>
                    <td><?= h($k['category']) ?></td>
                    <td><?= h($k['kpi_name']) ?></td>
                    <td class="num"><?= h((float)$k['sub_kpi_weight']) ?>%</td>
                    <td class="text-center"><span class="badge bg-emerald-100 text-emerald-800"><?= (int)$k['current_achievement'] ?>%</span></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php endif; ?>

<!-- Add Record modal -->
<?php if (can('can_edit')): ?>
<div class="modal-backdrop hidden" id="pcAddModal">
    <div class="modal-panel">
        <form method="post" action="index.php">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="pc_add">
            <div class="modal-head">
                <div>
                    <h3 class="text-sm font-black text-slate-900">Add performance contract record</h3>
                    <p class="text-[11px] text-slate-500">Capture a new KPI / indicator in the contract matrix.</p>
                </div>
                <button type="button" class="text-slate-400 hover:text-slate-700" data-close-modal>&times;</button>
            </div>
            <div class="modal-body space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label class="fld">KPI Code *</label><input class="inp" name="code" required placeholder="e.g. G1"></div>
                    <div>
                        <label class="fld">Category</label>
                        <select class="inp" name="category">
                            <option>Financial Stewardship</option>
                            <option>Service Delivery</option>
                            <option selected>Core Mandate</option>
                            <option>Implementation of Presidential Directives</option>
                            <option>Affirmative Action in Procurement</option>
                            <option>Cross - Cutting</option>
                        </select>
                    </div>
                    <div><label class="fld">Category Weight (%)</label><input class="inp" type="number" step="0.01" min="0" max="100" name="category_weight" value="0"></div>
                    <div><label class="fld">Delivery Unit</label><input class="inp" name="delivery_unit" placeholder="e.g. Directorate for Family Health"></div>
                    <div><label class="fld">Programme</label><input class="inp" name="programme" placeholder="e.g. UHC Programme"></div>
                    <div><label class="fld">Financial Year</label><input class="inp" name="financial_year" value="2026/2027"></div>
                </div>
                <div><label class="fld">Indicator / KPI Name *</label><input class="inp" name="kpi_name" required placeholder="Describe the indicator"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label class="fld">Target (2026/27)</label><input class="inp" name="target_baseline_2026_27" placeholder="e.g. 100%"></div>
                    <div><label class="fld">Baseline Score</label><input class="inp" name="baseline_score" placeholder="e.g. 90%"></div>
                    <div><label class="fld">Actual (2025/26)</label><input class="inp" name="actual_2025_26" placeholder="e.g. 88%"></div>
                    <div><label class="fld">Target (2025/26)</label><input class="inp" name="target_2025_26" placeholder="e.g. 100%"></div>
                    <div><label class="fld">Current Achievement (%)</label><input class="inp" type="number" min="0" max="100" name="current_achievement" value="0"></div>
                    <div>
                        <label class="fld">Status</label>
                        <select class="inp" name="status"><option>Approved</option><option>Pending</option><option>Draft</option></select>
                    </div>
                </div>
            </div>
            <div class="modal-foot">
                <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
                <button type="submit" class="btn btn-primary">Save record</button>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>
