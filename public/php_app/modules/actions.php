<?php
/** actions.php — action points + change request / approval workflow */
global $pdo;

$id = (int)($_GET['id'] ?? 0);
$tab = ($_GET['tab'] ?? 'details') === 'changes' ? 'changes' : 'details';
$actions = [];
$current = null;
$changes = [];

if ($pdo) {
    $actions = $pdo->query('SELECT * FROM action_points ORDER BY date DESC, id DESC')->fetchAll();
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM action_points WHERE id = ?');
        $stmt->execute([$id]);
        $current = $stmt->fetch();
        if ($current) {
            $stmt = $pdo->prepare('SELECT * FROM pending_changes WHERE action_id = ? ORDER BY requested_at DESC, id DESC');
            $stmt->execute([$id]);
            $changes = $stmt->fetchAll();
        }
    }
}

/* ===================== DETAIL VIEW ===================== */
if ($current):
    $pending = array_values(array_filter($changes, fn($c) => $c['status'] === 'Pending'));
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <a href="index.php?page=actions" class="text-[11px] font-bold text-blue-700 hover:underline">&larr; Back to action points</a>
        <h2 class="text-lg font-black text-slate-900 mt-1"><?= h($current['ref_no']) ?></h2>
        <p class="text-xs text-slate-500"><?= h($current['meeting_title']) ?> · <?= h(pretty_date($current['date'])) ?></p>
    </div>
    <span class="badge <?= h(status_badge($current['status'])) ?>"><?= h($current['status']) ?></span>
</div>

<div class="tab-strip">
    <a href="index.php?page=actions&id=<?= (int)$current['id'] ?>&tab=details" class="tab-link <?= $tab === 'details' ? 'active' : '' ?>">Action Details</a>
    <a href="index.php?page=actions&id=<?= (int)$current['id'] ?>&tab=changes" class="tab-link <?= $tab === 'changes' ? 'active' : '' ?>">Change Details &amp; Approval History (<?= count($changes) ?>)</a>
</div>

<?php if ($tab === 'details'): ?>
    <div class="card card-pad space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div><div class="text-[9px] uppercase font-bold text-slate-400">Reference</div><div class="font-mono font-bold text-slate-800"><?= h($current['ref_no']) ?></div></div>
            <div><div class="text-[9px] uppercase font-bold text-slate-400">Date</div><div class="font-semibold text-slate-800"><?= h(pretty_date($current['date'])) ?></div></div>
            <div><div class="text-[9px] uppercase font-bold text-slate-400">Person Responsible</div><div class="font-semibold text-slate-800"><?= h($current['person_responsible']) ?></div></div>
            <div><div class="text-[9px] uppercase font-bold text-slate-400">Timeline</div><div class="font-semibold text-slate-800"><?= h($current['timeline']) ?></div></div>
            <div class="sm:col-span-2"><div class="text-[9px] uppercase font-bold text-slate-400">Issue</div><div class="text-slate-700 leading-relaxed"><?= h($current['issue']) ?></div></div>
            <div class="sm:col-span-2"><div class="text-[9px] uppercase font-bold text-slate-400">Action</div><div class="text-slate-700 leading-relaxed"><?= h($current['action']) ?></div></div>
            <div class="sm:col-span-2"><div class="text-[9px] uppercase font-bold text-slate-400">Resolution Notes</div><div class="text-slate-700 leading-relaxed"><?= h($current['resolution_notes'] ?: '—') ?></div></div>
        </div>
        <?php if ($pending): ?>
            <div class="flash flash-ok !bg-amber-50 !text-amber-800 !border-amber-200"><?= count($pending) ?> change request(s) awaiting approval on this action.</div>
        <?php endif; ?>
        <div class="pt-2 border-t border-slate-100 flex gap-2">
            <button class="btn btn-primary" data-open-modal="changeModal-<?= (int)$current['id'] ?>">Request Change</button>
            <a class="btn btn-ghost" href="index.php?page=actions&id=<?= (int)$current['id'] ?>&tab=changes">View change history</a>
        </div>
    </div>

    <!-- Request change modal -->
    <div class="modal-backdrop hidden" id="changeModal-<?= (int)$current['id'] ?>">
        <div class="modal-panel">
            <form method="post" action="index.php">
                <?= csrf_field() ?>
                <input type="hidden" name="action" value="action_request_change">
                <input type="hidden" name="action_id" value="<?= (int)$current['id'] ?>">
                <div class="modal-head">
                    <div>
                        <h3 class="text-sm font-black text-slate-900">Request a change</h3>
                        <p class="text-[11px] text-slate-500"><?= h($current['ref_no']) ?> — changes require approval.</p>
                    </div>
                    <button type="button" class="text-slate-400 hover:text-slate-700" data-close-modal>&times;</button>
                </div>
                <div class="modal-body space-y-3">
                    <div>
                        <label class="fld">Field to change</label>
                        <select class="inp" name="field" id="chgField-<?= (int)$current['id'] ?>" required>
                            <option value="status">Status (current: <?= h($current['status']) ?>)</option>
                            <option value="action">Action</option>
                            <option value="person_responsible">Person Responsible (current: <?= h($current['person_responsible']) ?>)</option>
                            <option value="timeline">Timeline (current: <?= h($current['timeline']) ?>)</option>
                            <option value="resolution_notes">Resolution Notes</option>
                        </select>
                    </div>
                    <div>
                        <label class="fld">New value</label>
                        <input class="inp" name="new_value" required placeholder="Enter the proposed new value">
                    </div>
                    <div>
                        <label class="fld">Reason for change *</label>
                        <textarea class="inp" name="reason" rows="3" required placeholder="Explain why this change is needed"></textarea>
                    </div>
                    <p class="text-[10px] text-slate-400">The change will be recorded as PENDING APPROVAL and appear in the approval history with your account and timestamp.</p>
                </div>
                <div class="modal-foot">
                    <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit for approval</button>
                </div>
            </form>
        </div>
    </div>

<?php else: ?>
    <!-- Change details & approval history -->
    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 class="section-title">Change Details &amp; Approval History</h3>
            <?php if (!is_approver()): ?><span class="text-[10px] text-slate-400">Approval restricted to admin / PS / approvers</span><?php endif; ?>
        </div>
        <div class="divide-y divide-slate-100">
            <?php foreach ($changes as $c): ?>
                <div class="p-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="badge <?= h(status_badge($c['status'])) ?>"><?= h($c['status']) ?></span>
                            <span class="text-[11px] font-black text-slate-800"><?= h($c['field']) ?></span>
                        </div>
                        <span class="text-[10px] text-slate-400">Requested <?= h(pretty_datetime($c['requested_at'])) ?></span>
                    </div>
                    <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div class="bg-red-50 border border-red-100 rounded-lg p-2">
                            <div class="text-[9px] uppercase font-bold text-red-400">Old value</div>
                            <div class="text-red-800 font-semibold"><?= h($c['old_value'] ?: '—') ?></div>
                        </div>
                        <div class="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                            <div class="text-[9px] uppercase font-bold text-emerald-500">New value</div>
                            <div class="text-emerald-800 font-semibold"><?= h($c['new_value'] ?: '—') ?></div>
                        </div>
                    </div>
                    <div class="mt-2 text-[11px]"><span class="text-[9px] uppercase font-bold text-slate-400">Reason:</span> <span class="text-slate-700"><?= h($c['reason']) ?></span></div>
                    <div class="mt-1 text-[10px] text-slate-500">Requested by <b><?= h($c['requested_by']) ?></b></div>

                    <?php if ($c['status'] === 'Pending' && is_approver()): ?>
                        <div class="mt-2 flex gap-2">
                            <form method="post" action="index.php" onsubmit="return confirm('Approve this change?');">
                                <?= csrf_field() ?>
                                <input type="hidden" name="action" value="change_approve">
                                <input type="hidden" name="change_id" value="<?= (int)$c['id'] ?>">
                                <button class="btn btn-teal btn-sm" type="submit">Approve</button>
                            </form>
                            <form method="post" action="index.php" onsubmit="return confirm('Reject this change?');">
                                <?= csrf_field() ?>
                                <input type="hidden" name="action" value="change_reject">
                                <input type="hidden" name="change_id" value="<?= (int)$c['id'] ?>">
                                <button class="btn btn-danger btn-sm" type="submit">Reject</button>
                            </form>
                        </div>
                    <?php elseif ($c['status'] !== 'Pending'): ?>
                        <div class="mt-2 text-[10px] bg-slate-50 border border-slate-200 rounded-lg p-2">
                            <span class="font-bold text-slate-700"><?= h($c['status']) ?></span> by
                            <b><?= h($c['approved_by'] ?: '—') ?></b> on <?= h(pretty_datetime($c['approved_at'])) ?>
                        </div>
                    <?php else: ?>
                        <div class="mt-2 text-[10px] text-amber-700 font-semibold">Awaiting approval by an authorised account.</div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
            <?php if (!$changes): ?><div class="px-4 py-6 text-center text-slate-400 text-xs">No change requests recorded for this action yet.</div><?php endif; ?>
        </div>
    </div>
<?php endif; ?>

<?php else: ?>
<!-- ===================== LIST VIEW ===================== -->
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Action Points Tracker</h2>
        <p class="text-xs text-slate-500 mt-0.5">Track resolutions. Any change is recorded with a reason and requires approval.</p>
    </div>
    <span class="text-[11px] text-slate-500"><?= count($actions) ?> action points</span>
</div>

<div class="card">
    <div class="table-wrap">
        <table class="data">
            <thead>
                <tr><th>Ref</th><th>Meeting</th><th>Action</th><th>Responsible</th><th>Timeline</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
            <?php foreach ($actions as $a): ?>
                <tr>
                    <td class="font-mono font-bold text-blue-700 text-[10px]"><?= h($a['ref_no']) ?></td>
                    <td><?= h($a['meeting_title']) ?><div class="text-[10px] text-slate-500"><?= h(pretty_date($a['date'])) ?></div></td>
                    <td class="max-w-xs"><?= h(mb_strimwidth((string)$a['action'], 0, 90, '…')) ?></td>
                    <td><?= h($a['person_responsible']) ?></td>
                    <td><?= h($a['timeline']) ?></td>
                    <td><span class="badge <?= h(status_badge($a['status'])) ?>"><?= h($a['status']) ?></span></td>
                    <td class="text-right whitespace-nowrap">
                        <a class="btn btn-ghost btn-sm" href="index.php?page=actions&id=<?= (int)$a['id'] ?>&tab=details">Open</a>
                        <button class="btn btn-primary btn-sm" data-open-modal="quickChange-<?= (int)$a['id'] ?>">Request Change</button>
                    </td>
                </tr>
            <?php endforeach; ?>
            <?php if (!$actions): ?><tr><td colspan="7" class="text-center text-slate-400 py-6">No action points.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Quick change modals -->
<?php foreach ($actions as $a): ?>
    <div class="modal-backdrop hidden" id="quickChange-<?= (int)$a['id'] ?>">
        <div class="modal-panel">
            <form method="post" action="index.php">
                <?= csrf_field() ?>
                <input type="hidden" name="action" value="action_request_change">
                <input type="hidden" name="action_id" value="<?= (int)$a['id'] ?>">
                <div class="modal-head">
                    <div>
                        <h3 class="text-sm font-black text-slate-900">Request a change</h3>
                        <p class="text-[11px] text-slate-500"><?= h($a['ref_no']) ?></p>
                    </div>
                    <button type="button" class="text-slate-400 hover:text-slate-700" data-close-modal>&times;</button>
                </div>
                <div class="modal-body space-y-3">
                    <div>
                        <label class="fld">Field to change</label>
                        <select class="inp" name="field" required>
                            <option value="status">Status (current: <?= h($a['status']) ?>)</option>
                            <option value="action">Action</option>
                            <option value="person_responsible">Person Responsible (current: <?= h($a['person_responsible']) ?>)</option>
                            <option value="timeline">Timeline (current: <?= h($a['timeline']) ?>)</option>
                            <option value="resolution_notes">Resolution Notes</option>
                        </select>
                    </div>
                    <div><label class="fld">New value</label><input class="inp" name="new_value" required></div>
                    <div><label class="fld">Reason for change *</label><textarea class="inp" name="reason" rows="3" required></textarea></div>
                </div>
                <div class="modal-foot">
                    <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit for approval</button>
                </div>
            </form>
        </div>
    </div>
<?php endforeach; ?>
<?php endif; ?>
