<?php
/** notifications.php — notification centre + pending approvals */
global $pdo;

if (!can_view_notifications()) {
    echo '<div class="card card-pad text-center text-slate-500 text-sm">You do not have access to the notification centre.</div>';
    return;
}

$notifications = [];
$pending = [];
if ($pdo) {
    $notifications = $pdo->query('SELECT * FROM notifications ORDER BY is_read ASC, created_at DESC, id DESC')->fetchAll();
    $pending = $pdo->query('SELECT * FROM pending_changes WHERE status = "Pending" ORDER BY requested_at DESC')->fetchAll();
}
$unread = 0;
foreach ($notifications as $n) { if (!$n['is_read']) $unread++; }
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Notifications</h2>
        <p class="text-xs text-slate-500 mt-0.5">Persistent notification centre — read items are greyed out but always remain available.</p>
    </div>
    <div class="flex items-center gap-2">
        <span class="badge bg-blue-100 text-blue-800"><?= $unread ?> unread</span>
        <form method="post" action="index.php">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="notif_read_all">
            <button class="btn btn-ghost btn-sm" type="submit">Mark all as read</button>
        </form>
    </div>
</div>

<?php if ($pending): ?>
<div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
        <h3 class="section-title !text-amber-900">Pending Approvals (<?= count($pending) ?>)</h3>
        <span class="text-[10px] font-bold text-amber-700">Action change requests</span>
    </div>
    <div class="divide-y divide-slate-100">
        <?php foreach ($pending as $c): ?>
            <div class="p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="text-[11px] font-black text-slate-800"><?= h($c['ref_no']) ?> — <?= h($c['field']) ?></div>
                    <span class="text-[10px] text-slate-400"><?= h(pretty_datetime($c['requested_at'])) ?></span>
                </div>
                <div class="mt-1.5 text-[11px]">
                    <span class="text-red-700 line-through"><?= h($c['old_value'] ?: '—') ?></span>
                    <span class="mx-1 text-slate-400">&rarr;</span>
                    <span class="text-emerald-700 font-bold"><?= h($c['new_value'] ?: '—') ?></span>
                </div>
                <div class="text-[11px] text-slate-600 mt-1"><span class="text-[9px] uppercase font-bold text-slate-400">Reason:</span> <?= h($c['reason']) ?></div>
                <div class="text-[10px] text-slate-500 mt-0.5">Requested by <b><?= h($c['requested_by']) ?></b></div>
                <?php if (is_approver()): ?>
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
                        <a class="btn btn-ghost btn-sm" href="index.php?page=actions&id=<?= (int)$c['action_id'] ?>&tab=changes">Details</a>
                    </div>
                <?php else: ?>
                    <div class="mt-2 text-[10px] text-amber-700 font-semibold">Awaiting approval by an authorised account.</div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<div class="card">
    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 class="section-title">All notifications</h3>
        <span class="text-[11px] text-slate-500"><?= count($notifications) ?> total</span>
    </div>
    <div class="divide-y divide-slate-100">
        <?php foreach ($notifications as $n): ?>
            <a href="index.php?page=audit-logs&focus=<?= (int)$n['id'] ?>"
               class="block px-4 py-3 hover:bg-slate-50 <?= $n['is_read'] ? 'opacity-55 bg-slate-50' : '' ?>">
                <div class="flex items-start gap-3">
                    <span class="mt-1 w-2 h-2 rounded-full shrink-0 <?= $n['is_read'] ? 'bg-slate-300' : 'bg-blue-600' ?>"></span>
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div class="text-[12px] font-bold text-slate-800"><?= h($n['title']) ?></div>
                            <div class="flex items-center gap-2">
                                <span class="badge <?= h(status_badge($n['severity'] === 'approval' ? 'pending' : ($n['severity'] === 'warning' ? 'delayed' : 'approved'))) ?>"><?= h($n['severity']) ?></span>
                                <span class="text-[10px] text-slate-400"><?= h(pretty_datetime($n['created_at'])) ?></span>
                            </div>
                        </div>
                        <div class="text-[11px] text-slate-600 mt-0.5 leading-snug"><?= h($n['message']) ?></div>
                        <div class="text-[10px] text-slate-400 mt-1"><?= h($n['module']) ?> · <?= $n['is_read'] ? 'Read' : 'Unread' ?> · click to view in audit logs</div>
                    </div>
                </div>
            </a>
        <?php endforeach; ?>
        <?php if (!$notifications): ?><div class="px-4 py-6 text-center text-slate-400 text-xs">No notifications yet.</div><?php endif; ?>
    </div>
</div>
