<?php
/** dashboard.php */
global $pdo;

$stats = ['projects' => 0, 'flagships' => 0, 'kpis' => 0, 'pending' => 0, 'budget' => 0, 'utilised' => 0];
$recentProjects = [];
$recentLogs = [];

if ($pdo) {
    $stats['projects']   = (int)$pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn();
    $stats['flagships']  = (int)$pdo->query('SELECT COUNT(*) FROM flagships')->fetchColumn();
    $stats['kpis']       = (int)$pdo->query('SELECT COUNT(*) FROM performance_kpis')->fetchColumn();
    $stats['pending']    = (int)$pdo->query('SELECT COUNT(*) FROM pending_changes WHERE status = "Pending"')->fetchColumn();
    $stats['budget']     = (float)$pdo->query('SELECT COALESCE(SUM(total_budget),0) FROM projects')->fetchColumn();
    $stats['utilised']   = (float)$pdo->query('SELECT COALESCE(SUM(funds_utilized),0) FROM projects')->fetchColumn();
    $recentProjects = $pdo->query('SELECT * FROM projects ORDER BY id DESC LIMIT 5')->fetchAll();
    $recentLogs = $pdo->query('SELECT * FROM audit_logs ORDER BY timestamp DESC, id DESC LIMIT 6')->fetchAll();
}
$utilisation = $stats['budget'] > 0 ? round($stats['utilised'] / $stats['budget'] * 100, 1) : 0;
$cards = [
    ['Total Projects', $stats['projects'], 'Portfolio under delivery', 'bg-blue-50 text-blue-700'],
    ['Priority Flagships', $stats['flagships'], 'UHC & infrastructure', 'bg-indigo-50 text-indigo-700'],
    ['Performance KPIs', $stats['kpis'], 'Weighted result areas', 'bg-emerald-50 text-emerald-700'],
    ['Pending Approvals', $stats['pending'], 'Action change requests', 'bg-amber-50 text-amber-700'],
];
?>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <?php foreach ($cards as $c): ?>
        <div class="card card-pad">
            <div class="text-[10px] font-black uppercase tracking-wider text-slate-400"><?= h($c[0]) ?></div>
            <div class="text-2xl font-black text-slate-900 mt-1"><?= h((string)$c[1]) ?></div>
            <div class="text-[11px] font-semibold mt-1 <?= h($c[3]) ?> inline-block px-2 py-0.5 rounded"><?= h($c[2]) ?></div>
        </div>
    <?php endforeach; ?>
</div>

<div class="bg-gradient-to-r from-[#0a2356] via-[#0d3b82] to-[#0d47a1] text-white rounded-2xl p-7 shadow-md">
    <span class="bg-white/20 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">State Department for Medical Services</span>
    <h2 class="text-xl sm:text-2xl font-black mt-2">Project Performance, Service Delivery &amp; Operational Management System</h2>
    <p class="text-xs text-blue-100 max-w-3xl mt-2 leading-relaxed">
        Native PHP / MySQL application for cPanel. Manage priority flagships, inspect the project portfolio,
        track KPI-weighted progress, capture financing, coordinate the official diary, and run an auditable
        action-change approval workflow.
    </p>
    <div class="flex flex-wrap gap-3 mt-4 text-[11px]">
        <span class="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">Portfolio budget: <b><?= h(money($stats['budget'])) ?></b></span>
        <span class="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">Utilised: <b><?= h($utilisation) ?>%</b></span>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 class="section-title">Recent projects</h3>
            <a href="index.php?page=projects" class="text-[11px] font-bold text-blue-700 hover:underline">View all</a>
        </div>
        <div class="table-wrap">
            <table class="data">
                <thead><tr><th>Project</th><th>Status</th><th class="text-right">Budget</th></tr></thead>
                <tbody>
                <?php foreach ($recentProjects as $p): ?>
                    <tr>
                        <td>
                            <a class="proj-link" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a>
                            <div class="text-[10px] text-slate-500"><?= h($p['project_code']) ?></div>
                        </td>
                        <td><span class="badge <?= h(status_badge($p['status'])) ?>"><?= h($p['status']) ?></span></td>
                        <td class="text-right num"><?= h(kes_m($p['total_budget'])) ?>M</td>
                    </tr>
                <?php endforeach; ?>
                <?php if (!$recentProjects): ?><tr><td colspan="3" class="text-center text-slate-400 py-6">No projects yet.</td></tr><?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 class="section-title">Latest audit activity</h3>
            <a href="index.php?page=audit-logs" class="text-[11px] font-bold text-blue-700 hover:underline">Audit logs</a>
        </div>
        <div class="divide-y divide-slate-100">
            <?php foreach ($recentLogs as $l): ?>
                <div class="px-4 py-2.5">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-[11px] font-bold text-slate-800"><?= h($l['user_name']) ?></span>
                        <span class="text-[10px] text-slate-400"><?= h(pretty_datetime($l['timestamp'])) ?></span>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-0.5"><?= h($l['action']) ?> · <?= h($l['module']) ?> — <?= h(mb_strimwidth((string)$l['details'], 0, 90, '…')) ?></div>
                </div>
            <?php endforeach; ?>
            <?php if (!$recentLogs): ?><div class="px-4 py-6 text-center text-slate-400 text-xs">No activity yet.</div><?php endif; ?>
        </div>
    </div>
</div>
