<?php
/** flagships.php — priority flagships + linked projects (show all fields) */
global $pdo;

$showAll = !empty($_GET['showall']);
$flagships = [];
$projects = [];
$kpis = [];

if ($pdo) {
    $flagships = $pdo->query('SELECT * FROM flagships ORDER BY id ASC')->fetchAll();
    $projects  = $pdo->query('SELECT * FROM projects ORDER BY id ASC')->fetchAll();
    $kpis      = $pdo->query('SELECT * FROM performance_kpis ORDER BY id ASC')->fetchAll();
}

$byFlagship = [];
$unlinked = [];
foreach ($projects as $p) {
    if (!empty($p['flagship_id'])) $byFlagship[(int)$p['flagship_id']][] = $p;
    else $unlinked[] = $p;
}
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Priority Flagships</h2>
        <p class="text-xs text-slate-500 mt-0.5">UHC &amp; specialized infrastructure initiatives and their linked projects.</p>
    </div>
    <a href="index.php?page=flagships&showall=<?= $showAll ? '0' : '1' ?>"
       class="btn <?= $showAll ? 'btn-ghost' : 'btn-primary' ?>">
        <?= $showAll ? 'Hide all fields' : 'Show all fields' ?>
    </a>
</div>

<?php foreach ($flagships as $f):
    $linked = $byFlagship[(int)$f['id']] ?? [];
    $utilPct = ((float)$f['allocated_budget'] > 0) ? round((float)$f['utilized_budget'] / (float)$f['allocated_budget'] * 100, 1) : 0;
?>
    <div class="card overflow-hidden">
        <div class="h-1.5 bg-gradient-to-r from-[#0d47a1] to-[#40b5ad]"></div>
        <div class="card-pad space-y-3">
            <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="badge bg-red-600 text-white"><?= h($f['priority_tier']) ?></span>
                        <span class="badge <?= h(status_badge($f['status'])) ?>"><?= h($f['status']) ?></span>
                    </div>
                    <h3 class="text-base font-extrabold text-slate-900 mt-1.5"><?= h($f['title']) ?></h3>
                    <p class="text-xs text-slate-600 mt-1 max-w-3xl"><?= h($f['description']) ?></p>
                </div>
                <div class="text-right shrink-0">
                    <div class="text-[10px] uppercase font-bold text-slate-400">Progress</div>
                    <div class="text-xl font-black text-blue-700"><?= (int)$f['progress_pct'] ?>%</div>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                <div><div class="text-slate-400 font-bold uppercase text-[9px]">Lead Directorate</div><div class="font-semibold text-slate-800"><?= h($f['lead_directorate']) ?></div></div>
                <div><div class="text-slate-400 font-bold uppercase text-[9px]">Lead Officer</div><div class="font-semibold text-slate-800"><?= h($f['lead_officer']) ?></div></div>
                <div><div class="text-slate-400 font-bold uppercase text-[9px]">Allocated</div><div class="font-semibold text-slate-800 num"><?= h(kes_m($f['allocated_budget'])) ?>M</div></div>
                <div><div class="text-slate-400 font-bold uppercase text-[9px]">Utilised</div><div class="font-semibold text-slate-800 num"><?= h(kes_m($f['utilized_budget'])) ?>M (<?= h($utilPct) ?>%)</div></div>
            </div>

            <!-- Linked projects -->
            <div class="pt-3 border-t border-slate-100">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-500">Priority flagships linked projects (<?= count($linked) ?>)</div>
                </div>
                <?php if (!$linked): ?>
                    <div class="text-[11px] text-slate-400">No projects linked to this flagship yet.</div>
                <?php elseif (!$showAll): ?>
                    <ul class="space-y-1">
                        <?php foreach ($linked as $p): ?>
                            <li class="text-[11px]">
                                <a class="proj-link" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a>
                                <span class="text-slate-400">— <?= h($p['project_code']) ?> · <?= h($p['status']) ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>
        </div>

        <?php if ($showAll && $linked): ?>
            <div class="table-wrap border-t border-slate-200">
                <table class="data">
                    <thead>
                        <tr>
                            <th>Programme &amp; Sub-Programme</th>
                            <th>Code</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Delivery Unit</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Start</th>
                            <th>End</th>
                            <th class="text-right">Budget (M)</th>
                            <th class="text-right">Disbursed (M)</th>
                            <th class="text-right">Utilised (M)</th>
                            <th class="text-right">Outstanding (M)</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($linked as $p):
                        $prog = calc_project_progress($p, $kpis);
                        $outstanding = max(0, (float)$p['total_budget'] - (float)$p['funds_utilized']);
                    ?>
                        <tr>
                            <td>
                                <a class="proj-link" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a>
                                <div class="text-[10px] text-slate-500"><?= h($p['programme_title']) ?></div>
                            </td>
                            <td class="font-mono text-[10px]"><?= h($p['project_code']) ?></td>
                            <td><?= h($p['category']) ?></td>
                            <td><?= h($p['type']) ?></td>
                            <td><?= h($p['delivery_unit']) ?></td>
                            <td><?= h($p['location']) ?></td>
                            <td><span class="badge <?= h(status_badge($p['status'])) ?>"><?= h($p['status']) ?></span></td>
                            <td><?= h($p['priority_tier']) ?></td>
                            <td class="text-[10px]"><?= h(pretty_date($p['start_date'])) ?></td>
                            <td class="text-[10px]"><?= h(pretty_date($p['end_date'])) ?></td>
                            <td class="text-right num"><?= h(kes_m($p['total_budget'])) ?></td>
                            <td class="text-right num"><?= h(kes_m($p['funds_disbursed'])) ?></td>
                            <td class="text-right num"><?= h(kes_m($p['funds_utilized'])) ?></td>
                            <td class="text-right num"><?= h(kes_m($outstanding)) ?></td>
                            <td>
                                <div class="font-bold text-blue-700 text-[10px]"><?= h($prog['pct']) ?>%</div>
                                <div class="progress-track mt-1"><div class="progress-fill" style="width:<?= h($prog['pct']) ?>%"></div></div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
<?php endforeach; ?>

<?php if ($unlinked): ?>
    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100">
            <h3 class="section-title">Projects not linked to a flagship (<?= count($unlinked) ?>)</h3>
        </div>
        <div class="table-wrap">
            <table class="data">
                <thead><tr><th>Project</th><th>Code</th><th>Status</th><th class="text-right">Budget (M)</th><th>Progress</th></tr></thead>
                <tbody>
                <?php foreach ($unlinked as $p): $prog = calc_project_progress($p, $kpis); ?>
                    <tr>
                        <td><a class="proj-link" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a></td>
                        <td class="font-mono text-[10px]"><?= h($p['project_code']) ?></td>
                        <td><span class="badge <?= h(status_badge($p['status'])) ?>"><?= h($p['status']) ?></span></td>
                        <td class="text-right num"><?= h(kes_m($p['total_budget'])) ?></td>
                        <td class="font-bold text-blue-700"><?= h($prog['pct']) ?>%</td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
<?php endif; ?>
