<?php
/** projects.php — portfolio registry + finance records */
global $pdo;

$tab = ($_GET['tab'] ?? 'registries') === 'finance' ? 'finance' : 'registries';
$projects = [];
$kpis = [];
if ($pdo) {
    $projects = $pdo->query('SELECT * FROM projects ORDER BY id ASC')->fetchAll();
    $kpis = $pdo->query('SELECT * FROM performance_kpis ORDER BY id ASC')->fetchAll();
}

$totAlloc = 0; $totDisb = 0; $totUtil = 0;
foreach ($projects as $p) {
    $totAlloc += (float)$p['total_budget'];
    $totDisb  += (float)$p['funds_disbursed'];
    $totUtil  += (float)$p['funds_utilized'];
}
$totOut = max(0, $totAlloc - $totUtil);
$maxAlloc = 1;
foreach ($projects as $p) { $maxAlloc = max($maxAlloc, (float)$p['total_budget']); }
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Projects &amp; Programmes</h2>
        <p class="text-xs text-slate-500 mt-0.5">Manage the project registry and capture financing figures.</p>
    </div>
</div>

<div class="tab-strip">
    <a href="index.php?page=projects&tab=registries" class="tab-link <?= $tab === 'registries' ? 'active' : '' ?>">Manage Registries</a>
    <a href="index.php?page=projects&tab=finance" class="tab-link <?= $tab === 'finance' ? 'active' : '' ?>">Finance Records</a>
</div>

<?php if ($tab === 'registries'): ?>
    <div class="card">
        <div class="table-wrap">
            <table class="data">
                <thead>
                    <tr>
                        <th>Programme &amp; Sub-Programme</th>
                        <th>Code</th>
                        <th>Category</th>
                        <th>Delivery Unit</th>
                        <th>Status</th>
                        <th class="text-right">Budget (M)</th>
                        <th>Progress</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($projects as $p): $prog = calc_project_progress($p, $kpis); ?>
                    <tr>
                        <td>
                            <a class="proj-link" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a>
                            <div class="text-[10px] text-slate-500"><?= h($p['programme_title']) ?></div>
                        </td>
                        <td class="font-mono text-[10px]"><?= h($p['project_code']) ?></td>
                        <td><?= h($p['category']) ?></td>
                        <td><?= h($p['delivery_unit']) ?></td>
                        <td><span class="badge <?= h(status_badge($p['status'])) ?>"><?= h($p['status']) ?></span></td>
                        <td class="text-right num"><?= h(kes_m($p['total_budget'])) ?></td>
                        <td>
                            <div class="font-bold text-blue-700 text-[10px]"><?= h($prog['pct']) ?>%<?= $prog['is_derived'] ? ' <span class="text-emerald-600">(KPI)</span>' : '' ?></div>
                            <div class="progress-track mt-1"><div class="progress-fill" style="width:<?= h($prog['pct']) ?>%"></div></div>
                        </td>
                        <td><a class="btn btn-ghost btn-sm" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>">Open</a></td>
                    </tr>
                <?php endforeach; ?>
                <?php if (!$projects): ?><tr><td colspan="8" class="text-center text-slate-400 py-6">No projects yet.</td></tr><?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

<?php else: ?>
    <!-- Finance summary -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <?php
        $fin = [
            ['Budget Allocated', $totAlloc, 'text-blue-700'],
            ['Funds Disbursed', $totDisb, 'text-indigo-700'],
            ['Funds Utilised', $totUtil, 'text-emerald-700'],
            ['Funds Outstanding', $totOut, 'text-amber-700'],
        ];
        foreach ($fin as $f): ?>
            <div class="card card-pad">
                <div class="text-[10px] font-black uppercase tracking-wider text-slate-400"><?= h($f[0]) ?></div>
                <div class="text-xl font-black num mt-1 <?= h($f[2]) ?>"><?= h(kes_m($f[1])) ?>M</div>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- Financial Data (Amount in Millions) graph -->
    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100">
            <h3 class="section-title">Financial Data (Amount in Millions)</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Allocated vs utilised per project. Use “Edit” to update figures.</p>
        </div>
        <div class="card-pad space-y-3">
            <?php foreach ($projects as $p):
                $allocM = (float)$p['total_budget'] / 1000000;
                $utilM  = (float)$p['funds_utilized'] / 1000000;
                $allocW = $maxAlloc > 0 ? round((float)$p['total_budget'] / $maxAlloc * 100, 1) : 0;
                $utilW  = $maxAlloc > 0 ? round((float)$p['funds_utilized'] / $maxAlloc * 100, 1) : 0;
            ?>
                <div class="text-[11px]">
                    <div class="flex justify-between mb-1">
                        <span class="font-bold text-slate-700 truncate pr-2"><?= h($p['sub_programme']) ?></span>
                        <span class="num text-slate-500 shrink-0"><?= h(number_format($allocM, 1)) ?>M / <?= h(number_format($utilM, 1)) ?>M</span>
                    </div>
                    <div class="relative h-5 bg-slate-100 rounded overflow-hidden border border-slate-200">
                        <div class="absolute inset-y-0 left-0 bg-blue-200" style="width:<?= h($allocW) ?>%"></div>
                        <div class="absolute inset-y-0 left-0 bg-[#0d47a1]" style="width:<?= h($utilW) ?>%"></div>
                    </div>
                </div>
            <?php endforeach; ?>
            <div class="flex gap-4 text-[10px] pt-2 border-t border-slate-100">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-200"></span> Allocated</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#0d47a1]"></span> Utilised</span>
            </div>
        </div>
    </div>

    <!-- Finance records table -->
    <div class="card">
        <div class="table-wrap">
            <table class="data">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th class="text-right">Budget Allocated (M)</th>
                        <th class="text-right">Funds Disbursed (M)</th>
                        <th class="text-right">Funds Utilised (M)</th>
                        <th class="text-right">Funds Outstanding (M)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($projects as $p):
                    $out = max(0, (float)$p['total_budget'] - (float)$p['funds_utilized']);
                ?>
                    <tr>
                        <td>
                            <div class="font-bold text-slate-800"><?= h($p['sub_programme']) ?></div>
                            <div class="text-[10px] text-slate-500"><?= h($p['project_code']) ?></div>
                        </td>
                        <td class="text-right num"><?= h(kes_m($p['total_budget'])) ?></td>
                        <td class="text-right num"><?= h(kes_m($p['funds_disbursed'])) ?></td>
                        <td class="text-right num"><?= h(kes_m($p['funds_utilized'])) ?></td>
                        <td class="text-right num text-amber-700"><?= h(kes_m($out)) ?></td>
                        <td class="text-right">
                            <?php if (can('can_edit')): ?>
                                <button class="btn btn-primary btn-sm" data-open-modal="finModal-<?= (int)$p['id'] ?>">Edit</button>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Finance edit modals -->
    <?php if (can('can_edit')): foreach ($projects as $p): ?>
        <div class="modal-backdrop hidden" id="finModal-<?= (int)$p['id'] ?>">
            <div class="modal-panel">
                <form method="post" action="index.php">
                    <?= csrf_field() ?>
                    <input type="hidden" name="action" value="finance_save">
                    <input type="hidden" name="project_id" value="<?= (int)$p['id'] ?>">
                    <div class="modal-head">
                        <div>
                            <h3 class="text-sm font-black text-slate-900">Edit financing figures</h3>
                            <p class="text-[11px] text-slate-500"><?= h($p['sub_programme']) ?> · <?= h($p['project_code']) ?></p>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-slate-700" data-close-modal>&times;</button>
                    </div>
                    <div class="modal-body space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="fld">Budget Allocated (KES Millions)</label>
                                <input class="inp" type="number" step="0.01" min="0" name="budget_allocated_m" value="<?= h(number_format((float)$p['total_budget'] / 1000000, 2, '.', '')) ?>" required>
                            </div>
                            <div>
                                <label class="fld">Funds Disbursed (KES Millions)</label>
                                <input class="inp" type="number" step="0.01" min="0" name="funds_disbursed_m" value="<?= h(number_format((float)$p['funds_disbursed'] / 1000000, 2, '.', '')) ?>" required>
                            </div>
                            <div>
                                <label class="fld">Funds Utilised (KES Millions)</label>
                                <input class="inp" type="number" step="0.01" min="0" name="funds_utilised_m" value="<?= h(number_format((float)$p['funds_utilized'] / 1000000, 2, '.', '')) ?>" required>
                            </div>
                            <div>
                                <label class="fld">Funds Outstanding (auto)</label>
                                <input class="inp bg-slate-50" type="text" value="Allocated − Utilised" readonly>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400">Outstanding is calculated automatically as Budget Allocated − Funds Utilised. All figures are stored in KES.</p>
                    </div>
                    <div class="modal-foot">
                        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
                        <button type="submit" class="btn btn-primary">Save financing</button>
                    </div>
                </form>
            </div>
        </div>
    <?php endforeach; endif; ?>
<?php endif; ?>
