<?php
/**
 * audit-logs.php — audit trail + notification detail view.
 *
 * Supports ?focus={notification_id}: shows the notification with its full
 * details and the related audit entry, and marks the notification as read.
 */
global $pdo;

$focusId = isset($_GET['focus']) ? (int)$_GET['focus'] : 0;
$focusNotif = null;
$focusLog = null;

if ($focusId > 0 && $pdo) {
    $stmt = $pdo->prepare('SELECT * FROM notifications WHERE id = ?');
    $stmt->execute([$focusId]);
    $focusNotif = $stmt->fetch();

    if ($focusNotif) {
        // Mark as read (persists but greys out).
        if (!$focusNotif['is_read']) {
            $pdo->prepare('UPDATE notifications SET is_read = 1 WHERE id = ?')->execute([$focusId]);
            $focusNotif['is_read'] = 1;
        }
        if (!empty($focusNotif['related_log_id'])) {
            $stmt = $pdo->prepare('SELECT * FROM audit_logs WHERE id = ?');
            $stmt->execute([(int)$focusNotif['related_log_id']]);
            $focusLog = $stmt->fetch();
        }
    }
}

/* ---- filters ---- */
$filterModule = trim($_GET['module'] ?? '');
$filterAction = trim($_GET['act'] ?? '');
$search       = trim($_GET['q'] ?? '');

$where = [];
$args  = [];
if ($filterModule !== '') { $where[] = 'module = ?'; $args[] = $filterModule; }
if ($filterAction !== '') { $where[] = 'action = ?'; $args[] = $filterAction; }
if ($search !== '') {
    $where[] = '(details LIKE ? OR user_name LIKE ? OR email LIKE ? OR record_id LIKE ?)';
    $like = '%' . $search . '%';
    array_push($args, $like, $like, $like, $like);
}
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$logs = [];
$modules = [];
$actions = [];
if ($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM audit_logs $whereSql ORDER BY timestamp DESC, id DESC LIMIT 300");
        $stmt->execute($args);
        $logs = $stmt->fetchAll();
        $modules = $pdo->query('SELECT DISTINCT module FROM audit_logs WHERE module IS NOT NULL ORDER BY module')->fetchAll(PDO::FETCH_COLUMN);
        $actions = $pdo->query('SELECT DISTINCT action FROM audit_logs WHERE action IS NOT NULL ORDER BY action')->fetchAll(PDO::FETCH_COLUMN);
    } catch (Throwable $e) {
        $logs = [];
    }
}

/** Icon + colour for an audit action. */
function audit_action_style(string $action): array
{
    return match (strtolower($action)) {
        'create'  => ['bg-emerald-100 text-emerald-700', '+'],
        'update'  => ['bg-blue-100 text-blue-700', '~'],
        'approve' => ['bg-teal-100 text-teal-700', '✓'],
        'reject'  => ['bg-red-100 text-red-700', '✕'],
        'login'   => ['bg-slate-100 text-slate-600', '→'],
        'logout'  => ['bg-slate-100 text-slate-600', '←'],
        'delete'  => ['bg-red-100 text-red-700', '✕'],
        default   => ['bg-slate-100 text-slate-600', '•'],
    };
}
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Audit Logs</h2>
        <p class="text-xs text-slate-500 mt-0.5">Every change is recorded here. Clicking a notification opens its full detail below.</p>
    </div>
    <span class="badge bg-slate-100 text-slate-700"><?= count($logs) ?> entries</span>
</div>

<?php if ($focusNotif): ?>
<div class="card overflow-hidden" style="border-color:#bfdbfe;">
    <div class="px-4 py-3 border-b border-blue-200 bg-blue-50 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black <?= h(severity_color($focusNotif['severity'])) ?>">!</span>
            <h3 class="section-title !text-blue-900">Notification Detail</h3>
        </div>
        <a href="index.php?page=audit-logs" class="text-[10px] font-bold text-blue-700 hover:underline">Clear focus</a>
    </div>
    <div class="p-4">
        <div class="text-sm font-black text-slate-900"><?= h($focusNotif['title']) ?></div>
        <div class="text-[11px] text-slate-500 mt-0.5">
            <span class="badge <?= h(severity_color($focusNotif['severity'])) ?> !text-[9px]"><?= h(strtoupper($focusNotif['severity'])) ?></span>
            <span class="mx-1">·</span><?= h($focusNotif['module'] ?: 'System') ?>
            <span class="mx-1">·</span><?= h(pretty_datetime($focusNotif['created_at'])) ?>
        </div>
        <p class="text-[12px] text-slate-700 mt-3 leading-relaxed"><?= nl2br(h($focusNotif['message'])) ?></p>

        <?php if ($focusLog): ?>
        <div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div class="text-[9px] uppercase font-black tracking-wide text-slate-400 mb-1">Related audit entry</div>
            <div class="text-[11px] text-slate-700">
                <b><?= h($focusLog['user_name']) ?></b> (<?= h($focusLog['email']) ?>)
                performed <b><?= h($focusLog['action']) ?></b> on <b><?= h($focusLog['module']) ?></b>
                <?php if ($focusLog['record_id']): ?>· record #<?= h($focusLog['record_id']) ?><?php endif; ?>
                · <?= h(pretty_datetime($focusLog['timestamp'])) ?>
                · IP <?= h($focusLog['ip_address']) ?>
            </div>
            <div class="text-[11px] text-slate-600 mt-1"><?= h($focusLog['details']) ?></div>
        </div>
        <?php endif; ?>
    </div>
</div>
<?php elseif ($focusId > 0): ?>
<div class="card card-pad text-center text-slate-500 text-sm">Notification #<?= $focusId ?> could not be found.</div>
<?php endif; ?>

<form method="get" action="index.php" class="card card-pad">
    <input type="hidden" name="page" value="audit-logs">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div class="fld">
            <label>Search</label>
            <input class="inp" type="text" name="q" value="<?= h($search) ?>" placeholder="User, detail, record…">
        </div>
        <div class="fld">
            <label>Module</label>
            <select class="inp" name="module">
                <option value="">All modules</option>
                <?php foreach ($modules as $m): ?>
                    <option value="<?= h($m) ?>" <?= $filterModule === $m ? 'selected' : '' ?>><?= h($m) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="fld">
            <label>Action</label>
            <select class="inp" name="act">
                <option value="">All actions</option>
                <?php foreach ($actions as $a): ?>
                    <option value="<?= h($a) ?>" <?= $filterAction === $a ? 'selected' : '' ?>><?= h(ucfirst($a)) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="flex gap-2">
            <button class="btn btn-primary" type="submit">Filter</button>
            <a class="btn btn-ghost" href="index.php?page=audit-logs">Reset</a>
        </div>
    </div>
</form>

<div class="card overflow-hidden">
    <div class="overflow-x-auto">
        <table class="data">
            <thead>
                <tr>
                    <th>When</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Module</th>
                    <th>Record</th>
                    <th>Details</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!$logs): ?>
                    <tr><td colspan="7" class="text-center text-slate-400 py-8">No audit entries match your filters.</td></tr>
                <?php else: ?>
                    <?php foreach ($logs as $l): [$cls, $sym] = audit_action_style((string)$l['action']); ?>
                        <tr>
                            <td class="whitespace-nowrap text-[11px] text-slate-500"><?= h(pretty_datetime($l['timestamp'])) ?></td>
                            <td>
                                <div class="text-[11px] font-bold text-slate-800"><?= h($l['user_name'] ?: 'System') ?></div>
                                <div class="text-[10px] text-slate-400"><?= h($l['email'] ?: '—') ?></div>
                            </td>
                            <td>
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase <?= h($cls) ?>">
                                    <span><?= h($sym) ?></span><?= h($l['action']) ?>
                                </span>
                            </td>
                            <td class="text-[11px] text-slate-700"><?= h($l['module'] ?: '—') ?></td>
                            <td class="text-[11px] text-slate-500"><?= $l['record_id'] !== null && $l['record_id'] !== '' ? '#' . h($l['record_id']) : '—' ?></td>
                            <td class="text-[11px] text-slate-600 max-w-[420px]"><?= h($l['details']) ?></td>
                            <td class="text-[10px] text-slate-400 whitespace-nowrap"><?= h($l['ip_address'] ?: '—') ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
