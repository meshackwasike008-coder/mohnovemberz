<?php
/** project-view.php — project details: Action Board (KPI-derived, read-only) + Progress (bottom) */
global $pdo;

$id = (int)($_GET['id'] ?? 0);
$project = null;
$kpis = [];
$actions = [];
$history = [];

if ($pdo) {
    $stmt = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $project = $stmt->fetch();
    $kpis = $pdo->query('SELECT * FROM performance_kpis ORDER BY id ASC')->fetchAll();
    $actions = $pdo->query('SELECT * FROM action_points ORDER BY date DESC, id DESC')->fetchAll();
    if ($project) {
        $stmt = $pdo->prepare('SELECT * FROM project_monthly_progress WHERE project_id = ? ORDER BY id DESC');
        $stmt->execute([$id]);
        $history = $stmt->fetchAll();
    }
}

if (!$project) {
    echo '<div class="card card-pad text-center text-slate-500 text-sm">Project not found. <a class="text-blue-700 font-bold" href="index.php?page=projects">Back to projects</a></div>';
    return;
}

$prog = calc_project_progress($project, $kpis);
$outstanding = max(0, (float)$project['total_budget'] - (float)$project['funds_utilized']);

// Build a simple read-only action board from action points (status columns)
$board = ['ON TRACK' => [], 'STALLED' => [], 'COMPLETED' => []];
foreach ($actions as $a) {
    $s = strtoupper(trim($a['status']));
    if (isset($board[$s])) $board[$s][] = $a;
    else $board['ON TRACK'][] = $a;
}
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <a href="index.php?page=projects" class="text-[11px] font-bold text-blue-700 hover:underline">&larr; Back to projects</a>
        <h2 class="text-lg font-black text-slate-900 mt-1"><?= h($project['sub_programme']) ?></h2>
        <p class="text-xs text-slate-500"><?= h($project['programme_title']) ?> · <span class="font-mono"><?= h($project['project_code']) ?></span></p>
    </div>
    <div class="flex items-center gap-2">
        <span class="badge <?= h(status_badge($project['status'])) ?>"><?= h($project['status']) ?></span>
        <span class="badge bg-slate-100 text-slate-700"><?= h($project['priority_tier']) ?> priority</span>
    </div>
</div>

<!-- Overview -->
<div class="card card-pad">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Delivery Unit</div><div class="font-semibold text-slate-800"><?= h($project['delivery_unit']) ?></div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Category / Type</div><div class="font-semibold text-slate-800"><?= h($project['category']) ?> · <?= h($project['type']) ?></div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Location</div><div class="font-semibold text-slate-800"><?= h($project['location']) ?></div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Timeline</div><div class="font-semibold text-slate-800"><?= h(pretty_date($project['start_date'])) ?> → <?= h(pretty_date($project['end_date'])) ?></div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Budget Allocated</div><div class="font-semibold num text-slate-800"><?= h(kes_m($project['total_budget'])) ?>M</div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Funds Disbursed</div><div class="font-semibold num text-slate-800"><?= h(kes_m($project['funds_disbursed'])) ?>M</div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Funds Utilised</div><div class="font-semibold num text-slate-800"><?= h(kes_m($project['funds_utilized'])) ?>M</div></div>
        <div><div class="text-[9px] uppercase font-bold text-slate-400">Funds Outstanding</div><div class="font-semibold num text-amber-700"><?= h(kes_m($outstanding)) ?>M</div></div>
    </div>
    <?php if (!empty($project['description'])): ?>
        <p class="text-xs text-slate-600 mt-4 leading-relaxed border-t border-slate-100 pt-3"><?= h($project['description']) ?></p>
    <?php endif; ?>
</div>

<!-- ACTION BOARD (read-only, calculated from KPIs) -->
<div class="card">
    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
            <h3 class="section-title">Action Board</h3>
            <p class="text-[11px] text-slate-500">Read-only — action status and progress are calculated from linked KPIs.</p>
        </div>
        <span class="badge bg-slate-100 text-slate-600">Auto-calculated</span>
    </div>

    <!-- KPI-derived action status -->
    <div class="card-pad space-y-3">
        <div class="text-[10px] font-black uppercase tracking-wider text-slate-500">Linked KPIs</div>
        <?php if ($prog['linked']): ?>
            <div class="table-wrap">
                <table class="data">
                    <thead><tr><th>KPI Code</th><th>Indicator</th><th>Sub-weight</th><th class="text-center">Achievement</th><th>Contribution</th></tr></thead>
                    <tbody>
                    <?php foreach ($prog['linked'] as $k): $contrib = (float)$k['current_achievement'] * (float)($k['sub_kpi_weight'] ?: 1); ?>
                        <tr>
                            <td class="font-mono font-bold text-blue-700"><?= h($k['code']) ?></td>
                            <td><?= h($k['kpi_name']) ?></td>
                            <td class="num"><?= h((float)$k['sub_kpi_weight']) ?>%</td>
                            <td class="text-center"><span class="badge bg-emerald-100 text-emerald-800"><?= (int)$k['current_achievement'] ?>%</span></td>
                            <td class="num"><?= h(number_format($contrib, 1)) ?></td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <div class="text-[11px] text-slate-400">No linked KPIs — progress falls back to the recorded status (<?= h($project['progress_status']) ?>).</div>
        <?php endif; ?>

        <!-- Read-only action columns -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <?php foreach ($board as $col => $items): ?>
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-black uppercase tracking-wider text-slate-600"><?= h($col) ?></span>
                        <span class="badge <?= h(status_badge($col)) ?>"><?= count($items) ?></span>
                    </div>
                    <div class="space-y-1.5">
                        <?php foreach ($items as $a): ?>
                            <div class="bg-white border border-slate-200 rounded-lg p-2">
                                <div class="text-[10px] font-mono text-slate-400"><?= h($a['ref_no']) ?></div>
                                <div class="text-[11px] font-semibold text-slate-800 leading-snug"><?= h($a['action']) ?></div>
                                <div class="text-[9px] text-slate-500 mt-0.5"><?= h($a['person_responsible']) ?> · <?= h($a['timeline']) ?></div>
                            </div>
                        <?php endforeach; ?>
                        <?php if (!$items): ?><div class="text-[10px] text-slate-400">None</div><?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<!-- PROGRESS (bottom) — auto-captured title, time/date and user account -->
<div class="card overflow-hidden">
    <div class="h-1.5 bg-gradient-to-r from-[#40b5ad] to-[#0d47a1]"></div>
    <div class="card-pad">
        <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
                <h3 class="section-title">Progress</h3>
                <p class="text-[11px] text-slate-500">KPI-weighted delivery progress. Title, timestamp and user are captured automatically.</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-black text-[#0d47a1]"><?= h($prog['pct']) ?>%</div>
                <div class="text-[10px] font-bold <?= $prog['is_derived'] ? 'text-emerald-600' : 'text-slate-500' ?>">
                    <?= $prog['is_derived'] ? 'Calculated from ' . count($prog['linked']) . ' KPI(s)' : 'From recorded status' ?>
                </div>
            </div>
        </div>
        <div class="progress-track mt-3" style="height:12px"><div class="progress-fill" style="width:<?= h($prog['pct']) ?>%"></div></div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] border-t border-slate-100 pt-3">
            <div>
                <div class="text-[9px] uppercase font-bold text-slate-400">Title</div>
                <div class="font-semibold text-slate-800"><?= h($project['sub_programme']) ?></div>
            </div>
            <div>
                <div class="text-[9px] uppercase font-bold text-slate-400">Captured by</div>
                <div class="font-semibold text-slate-800"><?= h(current_user()['full_name'] ?? 'System') ?></div>
            </div>
            <div>
                <div class="text-[9px] uppercase font-bold text-slate-400">Capture</div>
                <div class="font-semibold text-slate-800">Automatic (system clock)</div>
            </div>
        </div>

        <?php if ($history): ?>
            <div class="mt-4 border-t border-slate-100 pt-3">
                <div class="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Progress history</div>
                <div class="table-wrap">
                    <table class="data">
                        <thead><tr><th>Period</th><th class="text-center">Progress</th><th>Remarks</th><th>Recorded by</th></tr></thead>
                        <tbody>
                        <?php foreach ($history as $hp): ?>
                            <tr>
                                <td class="font-semibold"><?= h($hp['period_month']) ?></td>
                                <td class="text-center"><span class="badge bg-blue-100 text-blue-800"><?= (int)$hp['progress_percentage'] ?>%</span></td>
                                <td class="text-slate-600"><?= h($hp['remarks']) ?></td>
                                <td class="text-slate-600"><?= h($hp['recorded_by']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
