<?php
/* =====================================================================
   PP-SDOMS — Standalone PHP / cPanel
   ---------------------------------------------------------------------
   IMPORTANT: this file REQUIRES the matching db.php (v2, with helpers).
   If you see "undefined function current_user()", you uploaded the new
   index.php but kept an older db.php. Upload BOTH files together.
   ===================================================================== */
require_once __DIR__ . '/db.php';

if (!function_exists('current_user') || !function_exists('audit_log') || !function_exists('notify')) {
    http_response_code(500);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html><head><meta charset="utf-8"><title>PP-SDOMS — db.php out of date</title>'
        . '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f172a;color:#e2e8f0;'
        . 'margin:0;padding:48px 20px}.card{max-width:760px;margin:0 auto;background:#1e293b;border:1px solid #334155;'
        . 'border-radius:14px;padding:32px}h1{margin:0 0 8px;font-size:22px;color:#f8fafc}'
        . 'p{line-height:1.65;color:#cbd5e1}code{background:#0f172a;border:1px solid #334155;border-radius:6px;'
        . 'padding:2px 6px;font-family:ui-monospace,Consolas,monospace;font-size:13px;color:#7dd3fc}'
        . 'ol{line-height:1.9;color:#cbd5e1}.tag{display:inline-block;background:#7f1d1d;color:#fecaca;'
        . 'border-radius:999px;padding:4px 12px;font-size:12px;font-weight:700;letter-spacing:.04em;margin-bottom:16px}'
        . 'b{color:#f8fafc}</style></head><body><div class="card">'
        . '<div class="tag">CONFIGURATION MISMATCH</div>'
        . '<h1>db.php is out of date</h1>'
        . '<p>Your <code>index.php</code> is the current version, but <code>db.php</code> is an older copy that is '
        . 'missing the shared helper functions (<code>current_user()</code>, <code>audit_log()</code>, '
        . '<code>notify()</code>, <code>project_progress()</code>, etc.).</p>'
        . '<p><b>Fix:</b> upload the <code>db.php</code> that ships with this package, replacing the existing one, '
        . 'and make sure both files are in the same folder.</p>'
        . '<ol><li>Open cPanel → <b>File Manager</b>.</li>'
        . '<li>Go to the folder containing <code>index.php</code>.</li>'
        . '<li>Upload <code>db.php</code> from the package and choose <b>Overwrite</b>.</li>'
        . '<li>Set the four database credentials at the top of <code>db.php</code>.</li>'
        . '<li>Reload this page.</li></ol>'
        . '<p>Package files must always be deployed together: <code>index.php</code>, <code>db.php</code>, '
        . '<code>schema.sql</code>, <code>migration_001.sql</code>, <code>migration_002_features.sql</code>.</p>'
        . '</div></body></html>';
    exit;
}

/* =====================================================================
   PP-SDOMS — Standalone PHP / cPanel
   Original layout & functionality retained; 8 additive features layered on.
   ===================================================================== */

/* --------------------------- CSRF token ----------------------------- */
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}
$CSRF = $_SESSION['csrf'];
function csrf_ok(): bool
{
    return isset($_POST['csrf']) && hash_equals($_SESSION['csrf'] ?? '', (string)$_POST['csrf']);
}

/* --------------------------- POST actions --------------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!csrf_ok()) {
        set_flash('error', 'Security token expired. Please try again.');
        redirect('?tab=' . ($_POST['return_tab'] ?? 'dashboard'));
    }
    $act = $_POST['action'];

    try {
        /* ---- switch account (header user selector) ---- */
        if ($act === 'switch_user') {
            $uid = (int)($_POST['uid'] ?? 0);
            if ($uid > 0) {
                $_SESSION['uid'] = $uid;
                $pdo->prepare('UPDATE users SET last_login = ? WHERE id = ?')->execute([now_stamp(), $uid]);
                audit_log('login', 'Authentication', 'User switched session account.', $uid);
            }
            redirect('?tab=' . ($_POST['return_tab'] ?? 'dashboard'));
        }

        /* ---- finance records save ---- */
        if ($act === 'finance_save') {
            $pid = (int)($_POST['project_id'] ?? 0);
            $alloc = m_to_kes($_POST['allocated'] ?? 0);
            $disb  = m_to_kes($_POST['disbursed'] ?? 0);
            $util  = m_to_kes($_POST['utilised'] ?? 0);
            $out   = m_to_kes($_POST['outstanding'] ?? 0);
            $pdo->prepare('UPDATE projects SET total_budget=?, funds_disbursed=?, funds_utilized=?, funds_outstanding=? WHERE id=?')
                ->execute([$alloc, $disb, $util, $out, $pid]);
            $pr = $pdo->prepare('SELECT programme_title, project_code FROM projects WHERE id=?');
            $pr->execute([$pid]);
            $prow = $pr->fetch();
            $logId = audit_log('update', 'Finance Records',
                'Updated financing for ' . ($prow['programme_title'] ?? ('Project #' . $pid)) .
                ': Allocated ' . m_fmt($alloc) . ', Disbursed ' . m_fmt($disb) .
                ', Utilised ' . m_fmt($util) . ', Outstanding ' . m_fmt($out), $pid);
            notify('Finance figures updated',
                'Budget allocation and disbursement for ' . ($prow['programme_title'] ?? ('Project #' . $pid)) . ' were updated.',
                'Finance Records', 'info', $logId);
            set_flash('success', 'Finance records saved for ' . ($prow['project_code'] ?? ('Project #' . $pid)) . '.');
            redirect('?tab=projects&view=finance');
        }

        /* ---- performance contract: add record ---- */
        if ($act === 'pc_add') {
            $stmt = $pdo->prepare(
                'INSERT INTO performance_contracts
                 (code, category, category_weight, delivery_unit, programme, kpi_name,
                  target_baseline_2026_27, current_achievement, status, financial_year, mock_2026_27)
                 VALUES (?,?,?,?,?,?,?,?,?,?,0)'
            );
            $stmt->execute([
                trim($_POST['code'] ?? ''),
                trim($_POST['category'] ?? ''),
                (float)($_POST['category_weight'] ?? 0),
                trim($_POST['delivery_unit'] ?? ''),
                trim($_POST['programme'] ?? ''),
                trim($_POST['kpi_name'] ?? ''),
                trim($_POST['target_baseline_2026_27'] ?? ''),
                (int)($_POST['current_achievement'] ?? 0),
                trim($_POST['status'] ?? 'Approved'),
                trim($_POST['financial_year'] ?? '2026/2027'),
            ]);
            $newId = (int)$pdo->lastInsertId();
            $logId = audit_log('create', 'Performance Contract',
                'Added performance contract record: ' . ($_POST['code'] ?? '') . ' — ' . ($_POST['kpi_name'] ?? ''), $newId);
            notify('Performance Contract record added',
                'A new indicator ' . ($_POST['code'] ?? '') . ' (' . ($_POST['kpi_name'] ?? '') . ') was added.',
                'Performance Contract', 'success', $logId);
            set_flash('success', 'Performance contract record added.');
            redirect('?tab=kpis');
        }

        /* ---- action point: request a change (pending approval) ---- */
        if ($act === 'action_request_change') {
            $aid = (int)($_POST['action_id'] ?? 0);
            $field = trim($_POST['field'] ?? 'Status');
            $newVal = trim($_POST['new_value'] ?? '');
            $reason = trim($_POST['reason'] ?? '');
            $ap = $pdo->prepare('SELECT * FROM action_points WHERE id=?');
            $ap->execute([$aid]);
            $aprow = $ap->fetch();
            if ($aprow && $newVal !== '' && $reason !== '') {
                $oldVal = (string)($aprow[strtolower(str_replace(' ', '_', $field))] ?? '');
                $u = current_user();
                $pdo->prepare(
                    'INSERT INTO pending_changes (action_id, ref_no, field, old_value, new_value, reason, requested_by, requested_at, status)
                     VALUES (?,?,?,?,?,?,?,?,?)'
                )->execute([$aid, $aprow['ref_no'], $field, $oldVal, $newVal, $reason,
                    $u['full_name'] ?? 'System', now_stamp(), 'Pending']);
                $logId = audit_log('update', 'Action Points Tracker',
                    'Change requested on ' . $aprow['ref_no'] . ': ' . $field . ' "' . $oldVal . '" -> "' . $newVal .
                    '". Reason: ' . $reason . '. Status: PENDING APPROVAL.', $aid);
                notify('Action change pending approval',
                    ($u['full_name'] ?? 'A user') . ' requested a change to ' . $aprow['ref_no'] . ' (' . $field . ': ' .
                    $oldVal . ' -> ' . $newVal . '). Reason: ' . $reason,
                    'Action Points Tracker', 'approval', $logId);
                set_flash('success', 'Change submitted for approval.');
            } else {
                set_flash('error', 'Please provide a new value and a reason.');
            }
            redirect('?tab=actions&id=' . $aid . '&view=changes');
        }

        /* ---- approve / reject a pending change ---- */
        if ($act === 'change_approve' || $act === 'change_reject') {
            $cid = (int)($_POST['change_id'] ?? 0);
            $pc = $pdo->prepare('SELECT * FROM pending_changes WHERE id=?');
            $pc->execute([$cid]);
            $pcrow = $pc->fetch();
            $u = current_user();
            if ($pcrow && is_approver($u) && strtolower($pcrow['status']) === 'pending') {
                $approve = ($act === 'change_approve');
                $status = $approve ? 'Approved' : 'Rejected';
                $pdo->prepare('UPDATE pending_changes SET status=?, approved_by=?, approved_at=? WHERE id=?')
                    ->execute([$status, $u['full_name'] ?? 'System', now_stamp(), $cid]);
                if ($approve) {
                    $col = strtolower(str_replace(' ', '_', $pcrow['field']));
                    $allowed = ['status', 'title', 'description', 'person_responsible', 'timeline', 'resolution_notes'];
                    if (in_array($col, $allowed, true)) {
                        $pdo->prepare("UPDATE action_points SET `$col`=? WHERE id=?")
                            ->execute([$pcrow['new_value'], $pcrow['action_id']]);
                    }
                }
                $logId = audit_log($approve ? 'approve' : 'reject', 'Action Points Tracker',
                    ($approve ? 'Approved' : 'Rejected') . ' change on ' . $pcrow['ref_no'] . ' (' . $pcrow['field'] . ': "' .
                    $pcrow['old_value'] . '" -> "' . $pcrow['new_value'] . '"). ' .
                    ($approve ? 'Approved' : 'Rejected') . ' by ' . ($u['full_name'] ?? 'System') . ' (' . ($u['role'] ?? '') . ').', $pcrow['action_id']);
                notify('Action change ' . strtolower($status),
                    ($u['full_name'] ?? 'Approver') . ' ' . strtolower($status) . ' the change on ' . $pcrow['ref_no'] . '.',
                    'Action Points Tracker', $approve ? 'success' : 'warning', $logId);
                set_flash('success', 'Change ' . strtolower($status) . '.');
            } else {
                set_flash('error', 'Not authorised or change already processed.');
            }
            redirect('?tab=actions&id=' . (int)($pcrow['action_id'] ?? 0) . '&view=changes');
        }

        /* ---- notifications: mark read ---- */
        if ($act === 'notif_read') {
            $nid = (int)($_POST['notif_id'] ?? 0);
            $pdo->prepare('UPDATE notifications SET is_read=1 WHERE id=?')->execute([$nid]);
            redirect('?tab=audit-logs&focus=' . $nid);
        }
        if ($act === 'notif_read_all') {
            $pdo->exec('UPDATE notifications SET is_read=1 WHERE is_read=0');
            redirect('?tab=notifications');
        }
    } catch (Throwable $e) {
        error_log('PP-SDOMS action error [' . ($act ?? '?') . ']: ' . $e->getMessage());
        set_flash('error', 'Action failed: ' . $e->getMessage());
        redirect('?tab=' . ($_POST['return_tab'] ?? 'dashboard'));
    }
}

/* --------------------------- Data loading --------------------------- */
$active_tab = $_GET['tab'] ?? 'dashboard';
$projects = [];
$flagships = [];
$kpis = [];
$actionPoints = [];
$meetings = [];
$events = [];
$notifications = [];
$pendingChanges = [];
$auditLogs = [];
$users = [];
$progressRows = [];

try {
    if (isset($pdo)) {
        $projects = $pdo->query("SELECT * FROM projects ORDER BY id ASC")->fetchAll();
        $flagships = $pdo->query("SELECT * FROM flagships ORDER BY id ASC")->fetchAll();
        // Original app queried performance_kpis; the schema table is performance_contracts.
        $kpis = $pdo->query("SELECT * FROM performance_contracts ORDER BY id ASC")->fetchAll();
        $actionPoints = $pdo->query("SELECT * FROM action_points ORDER BY id ASC")->fetchAll();
        $meetings = $pdo->query("SELECT * FROM meetings ORDER BY meeting_date DESC")->fetchAll();
        $events = $pdo->query("SELECT * FROM events ORDER BY event_date ASC")->fetchAll();
        $notifications = $pdo->query("SELECT * FROM notifications ORDER BY is_read ASC, created_at DESC, id DESC")->fetchAll();
        $pendingChanges = $pdo->query("SELECT * FROM pending_changes ORDER BY requested_at DESC, id DESC")->fetchAll();
        $auditLogs = $pdo->query("SELECT * FROM audit_logs ORDER BY timestamp DESC, id DESC")->fetchAll();
        $users = $pdo->query("SELECT * FROM users ORDER BY id ASC")->fetchAll();
    }
} catch (Exception $e) {
    $db_error = $e->getMessage();
}

$ME = current_user();
$unreadCount = unread_notifications();
$notifMenu = latest_notifications(6);
$flash = take_flash();
$projectsById = [];
foreach ($projects as $p) { $projectsById[(int)$p['id']] = $p; }
$kpisByCode = [];
foreach ($kpis as $k) { $kpisByCode[$k['code']] = $k; }

/* Helper: project title link with hover hint */
function project_link(array $p, string $cls = 'text-blue-700 font-semibold hover:underline'): string
{
    $title = $p['sub_programme'] ?: $p['programme_title'];
    return '<a href="?tab=project&id=' . (int)$p['id'] . '" class="proj-link ' . $cls .
        '" data-hint="Click to view details">' . h($title) . '</a>';
}

/* Helper: pending change count for an action */
function pending_for_action(array $changes, int $aid): int
{
    $n = 0;
    foreach ($changes as $c) {
        if ((int)$c['action_id'] === $aid && strtolower($c['status']) === 'pending') $n++;
    }
    return $n;
}

/* Focused notification for audit-logs page (marks read) */
$focusNotif = null;
if ($active_tab === 'audit-logs' && isset($_GET['focus']) && isset($pdo)) {
    $fid = (int)$_GET['focus'];
    $st = $pdo->prepare('SELECT * FROM notifications WHERE id=?');
    $st->execute([$fid]);
    $focusNotif = $st->fetch() ?: null;
    if ($focusNotif && !(int)$focusNotif['is_read']) {
        $pdo->prepare('UPDATE notifications SET is_read=1 WHERE id=?')->execute([$fid]);
        $focusNotif['is_read'] = 1;
    }
}

/* Project detail data */
$detailProject = null;
$detailProgress = null;
$detailActions = [];
$detailKpis = [];
if ($active_tab === 'project' && isset($_GET['id']) && isset($pdo)) {
    $pid = (int)$_GET['id'];
    $detailProject = $projectsById[$pid] ?? null;
    if ($detailProject) {
        $detailProgress = project_progress($detailProject, $kpis);
        $detailKpis = $detailProgress['linked'];
        foreach ($actionPoints as $a) {
            if ((int)$a['project_id'] === $pid) $detailActions[] = $a;
        }
        $st = $pdo->prepare('SELECT * FROM project_monthly_progress WHERE project_id=? ORDER BY id ASC');
        $st->execute([$pid]);
        $progressRows = $st->fetchAll();
    }
}

/* Action detail data */
$detailAction = null;
$actionChanges = [];
if ($active_tab === 'actions' && isset($_GET['id'])) {
    $aid = (int)$_GET['id'];
    foreach ($actionPoints as $a) { if ((int)$a['id'] === $aid) { $detailAction = $a; break; } }
    foreach ($pendingChanges as $c) { if ((int)$c['action_id'] === $aid) $actionChanges[] = $c; }
}

/* Total budget figures */
$totAlloc = 0; $totDisb = 0; $totUtil = 0; $totOut = 0;
foreach ($projects as $p) {
    $totAlloc += (float)$p['total_budget'];
    $totDisb  += (float)$p['funds_disbursed'];
    $totUtil  += (float)$p['funds_utilized'];
    $totOut   += (float)($p['funds_outstanding'] ?? max(0, (float)$p['total_budget'] - (float)$p['funds_disbursed']));
}
$pendingCount = 0;
foreach ($pendingChanges as $c) { if (strtolower($c['status']) === 'pending') $pendingCount++; }

/* Coat of arms inline SVG */
$coatOfArms = <<<SVG
<svg viewBox="0 0 64 72" xmlns="http://www.w3.org/2000/svg" class="w-9 h-10" aria-hidden="true">
  <g stroke="#c8a24a" stroke-width="2" stroke-linecap="round">
    <line x1="20" y1="6" x2="8" y2="66"/><line x1="44" y1="6" x2="56" y2="66"/>
  </g>
  <path d="M20 14 L44 14 L46 40 Q32 58 18 40 Z" fill="#0b1f3a" stroke="#c8a24a" stroke-width="1.5"/>
  <rect x="20" y="16" width="24" height="5" fill="#111"/>
  <rect x="20" y="21" width="24" height="5" fill="#b91c1c"/>
  <rect x="20" y="26" width="24" height="5" fill="#15803d"/>
  <ellipse cx="32" cy="40" rx="8" ry="11" fill="#f8fafc" stroke="#0b1f3a" stroke-width="1"/>
  <ellipse cx="32" cy="40" rx="4" ry="7" fill="#b91c1c"/>
  <path d="M28 12 q4 -6 8 0" fill="none" stroke="#c8a24a" stroke-width="1.5"/>
  <path d="M16 60 q16 8 32 0 l0 6 q-16 6 -32 0 z" fill="#c8a24a"/>
</svg>
SVG;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>State Department for Medical Services - PP-SDOMS</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f4f7fb; color: #1e293b; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
      .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,.55); z-index: 80; display: flex; align-items: flex-start; justify-content: center; padding: 3rem 1rem; overflow-y: auto; }
      .modal-panel { background: #fff; border-radius: .9rem; box-shadow: 0 20px 50px rgba(2,6,23,.35); width: 100%; max-width: 42rem; }
      .modal-panel.sm { max-width: 30rem; }
      .proj-link { position: relative; }
      .proj-link[data-hint]:hover::after { content: attr(data-hint); position: absolute; left: 0; top: 100%; margin-top: 2px; white-space: nowrap; background: #0f172a; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; z-index: 60; }
      .notif-menu { position: absolute; right: 0; top: 100%; margin-top: .5rem; width: 20rem; background: #fff; color: #1e293b; border-radius: .75rem; box-shadow: 0 16px 40px rgba(2,6,23,.25); border: 1px solid #e2e8f0; z-index: 70; }
      .notif-item.is-read { opacity: .55; background: #f8fafc; }
      .tablink { padding: .55rem .9rem; font-size: 11px; font-weight: 800; border-bottom: 2px solid transparent; }
      .tablink.active { border-color: #1d4ed8; color: #1d4ed8; background: rgba(239,246,255,.6); }
      [x-cloak], .hidden { display: none; }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col">

<!-- ===================== STICKY HEADER (whole row) ===================== -->
<div class="sticky top-0 z-50 shadow-md">
    <header class="bg-[#0d47a1] text-white">
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="bg-white/10 p-2 rounded-xl border border-white/20">
                    <?= $coatOfArms ?>
                </div>
                <div>
                    <div class="text-[10px] font-bold text-blue-200 tracking-widest uppercase">Republic of Kenya</div>
                    <h1 class="text-base sm:text-lg font-extrabold tracking-tight leading-tight">STATE DEPARTMENT FOR MEDICAL SERVICES</h1>
                    <div class="text-[11px] text-blue-100 font-medium">Project Performance, Service Delivery &amp; Operational Management System (PP-SDOMS)</div>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <div class="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Last login</div>
                    <div class="text-[11px] font-mono text-white"><?= h(pretty_dt($ME['last_login'] ?? now_stamp())) ?></div>
                </div>

                <form method="post" class="flex items-center">
                    <input type="hidden" name="action" value="switch_user">
                    <input type="hidden" name="csrf" value="<?= h($CSRF) ?>">
                    <input type="hidden" name="return_tab" value="<?= h($active_tab) ?>">
                    <select name="uid" onchange="this.form.submit()" class="bg-white/15 border border-white/25 rounded-full text-xs font-bold text-white px-3 py-1.5 max-w-[220px] focus:outline-none">
                        <?php foreach ($users as $u): ?>
                            <option value="<?= (int)$u['id'] ?>" class="text-slate-900" <?= ($ME && (int)$ME['id'] === (int)$u['id']) ? 'selected' : '' ?>>
                                <?= h($u['full_name']) ?> — <?= h($u['role']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </form>

                <!-- Notification bell -->
                <div class="relative">
                    <button type="button" data-toggle="notif" class="relative bg-white/15 hover:bg-white/25 border border-white/25 rounded-full p-2" aria-label="Notifications">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <?php if ($unreadCount > 0): ?>
                            <span class="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center"><?= $unreadCount ?></span>
                        <?php endif; ?>
                    </button>
                    <div id="notif" class="notif-menu hidden">
                        <div class="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                            <span class="text-xs font-black text-slate-800">Notifications</span>
                            <a href="?tab=notifications" class="text-[10px] font-bold text-blue-700 hover:underline">View all</a>
                        </div>
                        <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
                            <?php if (empty($notifMenu)): ?>
                                <div class="px-3 py-4 text-xs text-slate-500">No notifications.</div>
                            <?php else: foreach ($notifMenu as $n): ?>
                                <a href="?tab=audit-logs&focus=<?= (int)$n['id'] ?>" class="notif-item block px-3 py-2 hover:bg-slate-50 <?= (int)$n['is_read'] ? 'is-read' : '' ?>">
                                    <div class="flex items-center gap-2">
                                        <span class="text-[9px] font-black px-1.5 py-0.5 rounded <?= severity_classes($n['severity']) ?>"><?= h(strtoupper($n['severity'])) ?></span>
                                        <span class="text-[10px] text-slate-400 ml-auto font-mono"><?= h(pretty_dt($n['created_at'])) ?></span>
                                    </div>
                                    <div class="text-xs font-bold text-slate-800 mt-1"><?= h($n['title']) ?></div>
                                    <div class="text-[11px] text-slate-500 line-clamp-2"><?= h($n['message']) ?></div>
                                </a>
                            <?php endforeach; endif; ?>
                        </div>
                    </div>
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
            <a href="?tab=actions" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'actions' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Action Points</a>
            <?php if (can_view_notifications($ME)): ?>
                <a href="?tab=notifications" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'notifications' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Notifications<?php if ($unreadCount): ?><span class="ml-1 bg-red-600 text-white rounded-full px-1.5 text-[9px]"><?= $unreadCount ?></span><?php endif; ?></a>
            <?php endif; ?>
            <a href="?tab=audit-logs" class="px-4 py-3 text-xs font-extrabold border-b-2 <?= $active_tab === 'audit-logs' ? 'border-blue-700 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-600 hover:text-slate-900' ?>">Audit Logs</a>
        </div>
    </nav>
</div>

<!-- Main Content Container -->
<main class="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
    <?php if (isset($db_error)): ?>
        <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs text-amber-800 font-medium">
            Database Note: <?= h($db_error); ?> (Please import <code>schema.sql</code> and <code>migration_002_features.sql</code> via phpMyAdmin).
        </div>
    <?php endif; ?>
    <?php if ($flash): ?>
        <div class="border-l-4 p-3 rounded text-xs font-semibold <?= $flash['type'] === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700' ?>">
            <?= h($flash['msg']) ?>
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

        <?php if ($pendingCount > 0): ?>
        <a href="?tab=notifications" class="block bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between hover:bg-amber-100">
            <div class="flex items-center gap-3">
                <span class="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded">PENDING APPROVALS</span>
                <span class="text-xs font-semibold text-amber-900"><?= $pendingCount ?> action change<?= $pendingCount === 1 ? '' : 's' ?> awaiting your review.</span>
            </div>
            <span class="text-xs font-bold text-amber-800">Review &rarr;</span>
        </a>
        <?php endif; ?>

        <!-- Welcome Banner -->
        <div class="bg-[#0d47a1] text-white p-8 rounded-2xl shadow-md space-y-3">
            <span class="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">State Department for Medical Services</span>
            <h2 class="text-2xl font-black">Project Performance, Service Delivery &amp; Operational Management System</h2>
            <p class="text-xs text-blue-100 max-w-3xl leading-relaxed">
                This standalone PHP application runs natively on cPanel with Apache and MySQL without requiring any Node.js runtime. Use the top navigation tabs to manage priority flagships, inspect project portfolios, track monthly progress with weighted KPI contribution categories (A–F), and coordinate official diaries.
            </p>
        </div>

    <?php elseif ($active_tab === 'flagships'): ?>
        <?php $showAll = isset($_GET['showall']) && $_GET['showall'] == '1'; ?>
        <!-- Priority Flagships -->
        <div class="space-y-4">
            <h2 class="text-lg font-black text-slate-900">Priority Flagships (UHC &amp; Specialized Infrastructure)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <?php foreach ($flagships as $f): ?>
                    <?php
                    $linked = [];
                    foreach ($projects as $p) {
                        if ((int)($p['flagship_id'] ?? 0) === (int)$f['id']) $linked[] = $p;
                    }
                    ?>
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-[#0d47a1] p-5 space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase"><?= h($f['priority_tier']); ?></span>
                            <span class="text-xs font-bold text-slate-500">Due: <?= h($f['target_date']); ?></span>
                        </div>
                        <h3 class="font-extrabold text-base text-slate-900"><?= h($f['title']); ?></h3>
                        <p class="text-xs text-slate-600"><?= h($f['description']); ?></p>
                        <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span class="font-bold text-blue-700">Progress: <?= (int)$f['progress_pct']; ?>%</span>
                            <span class="text-slate-500 font-medium">Lead: <?= h($f['lead_officer']); ?></span>
                        </div>

                        <!-- Priority flagships linked projects -->
                        <div class="pt-3 border-t border-slate-100">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Priority flagships linked projects (<?= count($linked) ?>)</span>
                                <a href="?tab=flagships&showall=<?= $showAll ? '0' : '1' ?>" class="text-[10px] font-bold text-blue-700 hover:underline">
                                    <?= $showAll ? 'Show less' : 'Show all fields' ?>
                                </a>
                            </div>
                            <?php if (empty($linked)): ?>
                                <div class="text-[11px] text-slate-400">No linked projects.</div>
                            <?php else: ?>
                                <ul class="space-y-1">
                                    <?php foreach ($linked as $lp): ?>
                                        <li class="text-xs"><?= project_link($lp) ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <?php if ($showAll): ?>
            <!-- All fields view of linked projects (mirrors projects table columns) -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <div class="px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-black text-slate-700 uppercase tracking-wide">All Linked Project Fields</div>
                <table class="w-full text-xs text-left min-w-[1100px]">
                    <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                        <tr>
                            <th class="py-2 px-3">Code</th>
                            <th class="py-2 px-3">Programme &amp; Sub-Programme</th>
                            <th class="py-2 px-3">Category</th>
                            <th class="py-2 px-3">Directorate</th>
                            <th class="py-2 px-3">Saga</th>
                            <th class="py-2 px-3">Division</th>
                            <th class="py-2 px-3">Delivery Unit</th>
                            <th class="py-2 px-3">Location</th>
                            <th class="py-2 px-3">Type</th>
                            <th class="py-2 px-3">Status</th>
                            <th class="py-2 px-3">Priority</th>
                            <th class="py-2 px-3">Start</th>
                            <th class="py-2 px-3">End</th>
                            <th class="py-2 px-3 text-right">Budget (KES)</th>
                            <th class="py-2 px-3">Progress</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($projects as $pr): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="py-2 px-3 font-mono font-bold text-blue-700"><?= h($pr['project_code']) ?></td>
                                <td class="py-2 px-3">
                                    <div class="font-extrabold text-slate-900"><?= h($pr['sub_programme']) ?></div>
                                    <div class="text-[11px] text-slate-500"><?= h($pr['programme_title']) ?></div>
                                </td>
                                <td class="py-2 px-3"><?= h($pr['category']) ?></td>
                                <td class="py-2 px-3"><?= h($pr['directorate_name']) ?></td>
                                <td class="py-2 px-3"><?= h($pr['saga_name']) ?></td>
                                <td class="py-2 px-3"><?= h($pr['division_name']) ?></td>
                                <td class="py-2 px-3"><?= h($pr['delivery_unit']) ?></td>
                                <td class="py-2 px-3"><?= h($pr['location']) ?></td>
                                <td class="py-2 px-3"><?= h($pr['type']) ?></td>
                                <td class="py-2 px-3"><span class="<?= status_classes($pr['status']) ?> px-2 py-0.5 rounded font-bold text-[10px]"><?= h($pr['status']) ?></span></td>
                                <td class="py-2 px-3"><?= h($pr['priority_tier']) ?></td>
                                <td class="py-2 px-3"><?= h(pretty_d($pr['start_date'])) ?></td>
                                <td class="py-2 px-3"><?= h(pretty_d($pr['end_date'])) ?></td>
                                <td class="py-2 px-3 text-right font-mono font-bold"><?= number_format((float)$pr['total_budget'], 2) ?></td>
                                <td class="py-2 px-3"><?= h($pr['progress_status']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </div>

    <?php elseif ($active_tab === 'projects'): ?>
        <?php $view = $_GET['view'] ?? 'registries'; ?>
        <!-- Projects Portfolio -->
        <div class="space-y-4">
            <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <h2 class="text-base font-black text-slate-900">All Priority Projects &amp; Programmes</h2>
            </div>

            <!-- Tab strip: Manage Registries | Finance Records -->
            <div class="bg-white rounded-xl border border-slate-200 px-2 flex space-x-1">
                <a href="?tab=projects&view=registries" class="tablink <?= $view !== 'finance' ? 'active' : 'text-slate-600' ?>">Manage Registries</a>
                <a href="?tab=projects&view=finance" class="tablink <?= $view === 'finance' ? 'active' : 'text-slate-600' ?>">Finance Records</a>
            </div>

            <?php if ($view === 'finance'): ?>
                <!-- Finance Records -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div class="text-[11px] font-bold uppercase text-slate-400">Budget Allocated</div><div class="text-xl font-black text-slate-900 mt-1 font-mono"><?= m_fmt($totAlloc) ?></div></div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div class="text-[11px] font-bold uppercase text-slate-400">Funds Disbursed</div><div class="text-xl font-black text-blue-700 mt-1 font-mono"><?= m_fmt($totDisb) ?></div></div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div class="text-[11px] font-bold uppercase text-slate-400">Funds Utilised</div><div class="text-xl font-black text-emerald-700 mt-1 font-mono"><?= m_fmt($totUtil) ?></div></div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div class="text-[11px] font-bold uppercase text-slate-400">Funds Outstanding</div><div class="text-xl font-black text-amber-700 mt-1 font-mono"><?= m_fmt($totOut) ?></div></div>
                </div>

                <!-- Financial Data (Amount in Millions) graph -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h3 class="text-sm font-black text-slate-900 border-b border-slate-200 pb-3">Financial Data (Amount in Millions)</h3>
                    <div class="space-y-4">
                        <?php foreach ($projects as $p):
                            $allocM = (float)$p['total_budget'] / 1000000;
                            $disbM  = (float)$p['funds_disbursed'] / 1000000;
                            $utilM  = (float)$p['funds_utilized'] / 1000000;
                            $outM   = (float)($p['funds_outstanding'] ?? max(0, (float)$p['total_budget'] - (float)$p['funds_disbursed'])) / 1000000;
                            $scale  = $allocM > 0 ? $allocM : 1;
                        ?>
                        <div class="text-xs">
                            <div class="flex justify-between items-center mb-1">
                                <span class="font-bold text-slate-800"><?= h($p['sub_programme']) ?> <span class="text-slate-400 font-mono">(<?= h($p['project_code']) ?>)</span></span>
                                <span class="font-mono font-bold text-slate-600"><?= number_format($allocM, 2) ?>M</span>
                            </div>
                            <div class="grid grid-cols-12 items-center gap-2">
                                <div class="col-span-10 space-y-1">
                                    <div class="flex items-center gap-2"><span class="w-16 text-[10px] text-slate-500">Allocated</span><div class="flex-1 bg-slate-100 h-3 rounded overflow-hidden"><div class="bg-[#1976d2] h-full" style="width: <?= $allocM > 0 ? 100 : 0 ?>%"></div></div></div>
                                    <div class="flex items-center gap-2"><span class="w-16 text-[10px] text-slate-500">Disbursed</span><div class="flex-1 bg-slate-100 h-3 rounded overflow-hidden"><div class="bg-[#f97316] h-full" style="width: <?= min(100, $disbM / $scale * 100) ?>%"></div></div></div>
                                    <div class="flex items-center gap-2"><span class="w-16 text-[10px] text-slate-500">Utilised</span><div class="flex-1 bg-slate-100 h-3 rounded overflow-hidden"><div class="bg-[#40B5AD] h-full" style="width: <?= min(100, $utilM / $scale * 100) ?>%"></div></div></div>
                                    <div class="flex items-center gap-2"><span class="w-16 text-[10px] text-slate-500">Outstanding</span><div class="flex-1 bg-slate-100 h-3 rounded overflow-hidden"><div class="bg-[#8b5cf6] h-full" style="width: <?= min(100, $outM / $scale * 100) ?>%"></div></div></div>
                                </div>
                                <div class="col-span-2 text-right font-mono text-[10px] text-slate-500">
                                    <div>D <?= number_format($disbM, 2) ?>M</div>
                                    <div>U <?= number_format($utilM, 2) ?>M</div>
                                    <div>O <?= number_format($outM, 2) ?>M</div>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-[11px]">
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#1976d2]"></span><span>Budget Allocated</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#f97316]"></span><span>Funds Disbursed</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#40B5AD]"></span><span>Funds Utilised</span></div>
                        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-[#8b5cf6]"></span><span>Funds Outstanding</span></div>
                    </div>
                </div>

                <!-- Finance table with edit modals -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                            <tr>
                                <th class="py-3 px-4">Project</th>
                                <th class="py-3 px-3 text-right">Budget Allocated</th>
                                <th class="py-3 px-3 text-right">Funds Disbursed</th>
                                <th class="py-3 px-3 text-right">Funds Utilised</th>
                                <th class="py-3 px-3 text-right">Funds Outstanding</th>
                                <th class="py-3 px-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($projects as $p): ?>
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-4">
                                        <div class="font-extrabold text-slate-900"><?= h($p['sub_programme']) ?></div>
                                        <div class="text-[11px] text-slate-500 font-mono"><?= h($p['project_code']) ?></div>
                                    </td>
                                    <td class="py-3 px-3 text-right font-mono font-bold"><?= m_fmt($p['total_budget']) ?></td>
                                    <td class="py-3 px-3 text-right font-mono"><?= m_fmt($p['funds_disbursed']) ?></td>
                                    <td class="py-3 px-3 text-right font-mono"><?= m_fmt($p['funds_utilized']) ?></td>
                                    <td class="py-3 px-3 text-right font-mono text-amber-700"><?= m_fmt($p['funds_outstanding'] ?? max(0, (float)$p['total_budget'] - (float)$p['funds_disbursed'])) ?></td>
                                    <td class="py-3 px-3 text-center">
                                        <button type="button" data-open="finModal-<?= (int)$p['id'] ?>" class="bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-bold px-3 py-1.5 rounded">Edit</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Finance edit modals -->
                <?php foreach ($projects as $p): ?>
                    <div id="finModal-<?= (int)$p['id'] ?>" class="modal-backdrop hidden">
                        <div class="modal-panel">
                            <div class="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                                <h3 class="text-sm font-black text-slate-900">Edit Financing — <?= h($p['project_code']) ?></h3>
                                <button type="button" data-close="finModal-<?= (int)$p['id'] ?>" class="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
                            </div>
                            <form method="post" class="p-5 space-y-3">
                                <input type="hidden" name="action" value="finance_save">
                                <input type="hidden" name="csrf" value="<?= h($CSRF) ?>">
                                <input type="hidden" name="project_id" value="<?= (int)$p['id'] ?>">
                                <div class="text-xs text-slate-500 mb-1"><?= h($p['sub_programme']) ?></div>
                                <div class="grid grid-cols-2 gap-3">
                                    <label class="text-[11px] font-bold text-slate-600">Budget Allocated (M)
                                        <input type="number" step="0.01" min="0" name="allocated" value="<?= number_format((float)$p['total_budget'] / 1000000, 2, '.', '') ?>" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono">
                                    </label>
                                    <label class="text-[11px] font-bold text-slate-600">Funds Disbursed (M)
                                        <input type="number" step="0.01" min="0" name="disbursed" value="<?= number_format((float)$p['funds_disbursed'] / 1000000, 2, '.', '') ?>" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono">
                                    </label>
                                    <label class="text-[11px] font-bold text-slate-600">Funds Utilised (M)
                                        <input type="number" step="0.01" min="0" name="utilised" value="<?= number_format((float)$p['funds_utilized'] / 1000000, 2, '.', '') ?>" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono">
                                    </label>
                                    <label class="text-[11px] font-bold text-slate-600">Funds Outstanding (M)
                                        <input type="number" step="0.01" min="0" name="outstanding" value="<?= number_format((float)($p['funds_outstanding'] ?? max(0, (float)$p['total_budget'] - (float)$p['funds_disbursed'])) / 1000000, 2, '.', '') ?>" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono">
                                    </label>
                                </div>
                                <div class="flex justify-end gap-2 pt-2">
                                    <button type="button" data-close="finModal-<?= (int)$p['id'] ?>" class="px-3 py-1.5 rounded text-xs font-bold bg-slate-100 text-slate-700">Cancel</button>
                                    <button type="submit" class="px-3 py-1.5 rounded text-xs font-bold bg-blue-700 text-white">Save figures</button>
                                </div>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>

            <?php else: ?>
                <!-- Manage Registries: original projects table -->
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
                                        <div class="font-extrabold text-slate-900"><?= project_link($pr, 'font-extrabold text-slate-900 hover:underline') ?></div>
                                        <div class="text-[11px] text-slate-500"><?= h($pr['programme_title']); ?></div>
                                    </td>
                                    <td class="py-3 px-3 font-semibold text-slate-700"><?= h($pr['category']); ?></td>
                                    <td class="py-3 px-3">
                                        <span class="<?= status_classes($pr['status']) ?> px-2 py-0.5 rounded font-bold text-[10px]"><?= h($pr['status']); ?></span>
                                    </td>
                                    <td class="py-3 px-3 text-right font-mono font-bold text-slate-900"><?= number_format($pr['total_budget'], 2); ?></td>
                                    <td class="py-3 px-4">
                                        <div class="font-bold text-blue-700 mb-1"><?= h($pr['progress_status']); ?></div>
                                        <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div class="bg-[#40B5AD] h-full rounded-full" style="width: <?= (int)preg_replace('/[^0-9]/', '', (string)$pr['progress_status']); ?>%;"></div>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
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
                    <div class="flex items-center gap-3">
                        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-center min-w-[190px]">
                            <div class="text-[10px] uppercase font-bold tracking-wider text-blue-200">Overall Ministerial Score</div>
                            <div class="text-3xl font-black text-yellow-300 font-mono mt-0.5">91.5%</div>
                            <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">All Targets On Track</div>
                        </div>
                        <button type="button" data-open="pcAddModal" class="bg-white text-[#0a2356] text-xs font-black px-4 py-2 rounded-lg hover:bg-blue-50">+ Add Record</button>
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
                                    <span class="font-mono font-bold text-blue-700"><?= h($kp['code']); ?></span>
                                    <div class="font-bold text-slate-800"><?= h($kp['category']); ?></div>
                                </td>
                                <td class="py-3 px-3 font-mono font-bold"><?= $kp['category_weight']; ?>%</td>
                                <td class="py-3 px-3 font-medium text-slate-800"><?= h($kp['kpi_name']); ?></td>
                                <td class="py-3 px-3 text-slate-600"><?= h($kp['delivery_unit']); ?></td>
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

        <!-- Add Record modal -->
        <div id="pcAddModal" class="modal-backdrop hidden">
            <div class="modal-panel">
                <div class="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                    <h3 class="text-sm font-black text-slate-900">Add Performance Contract Record</h3>
                    <button type="button" data-close="pcAddModal" class="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
                </div>
                <form method="post" class="p-5 space-y-3">
                    <input type="hidden" name="action" value="pc_add">
                    <input type="hidden" name="csrf" value="<?= h($CSRF) ?>">
                    <div class="grid grid-cols-2 gap-3">
                        <label class="text-[11px] font-bold text-slate-600">Code
                            <input required name="code" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono" placeholder="C3.3">
                        </label>
                        <label class="text-[11px] font-bold text-slate-600">Category
                            <input required name="category" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs" placeholder="Core Mandate">
                        </label>
                        <label class="text-[11px] font-bold text-slate-600">Weight (%)
                            <input type="number" step="0.01" name="category_weight" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono" placeholder="10">
                        </label>
                        <label class="text-[11px] font-bold text-slate-600">Delivery Unit
                            <input name="delivery_unit" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs" placeholder="Directorate">
                        </label>
                    </div>
                    <label class="text-[11px] font-bold text-slate-600 block">Programme
                        <input name="programme" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                    </label>
                    <label class="text-[11px] font-bold text-slate-600 block">KPI Name
                        <input required name="kpi_name" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="text-[11px] font-bold text-slate-600">Target / Baseline 2026/27
                            <input name="target_baseline_2026_27" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                        </label>
                        <label class="text-[11px] font-bold text-slate-600">Current Achievement (%)
                            <input type="number" name="current_achievement" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono" placeholder="0">
                        </label>
                        <label class="text-[11px] font-bold text-slate-600">Status
                            <select name="status" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                                <option>Approved</option><option>Pending</option><option>In Progress</option>
                            </select>
                        </label>
                        <label class="text-[11px] font-bold text-slate-600">Financial Year
                            <input name="financial_year" value="2026/2027" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                        </label>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" data-close="pcAddModal" class="px-3 py-1.5 rounded text-xs font-bold bg-slate-100 text-slate-700">Cancel</button>
                        <button type="submit" class="px-3 py-1.5 rounded text-xs font-bold bg-blue-700 text-white">Add record</button>
                    </div>
                </form>
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
                <?php foreach ($events as $ev): ?>
                    <button type="button" data-open="evModal-<?= (int)$ev['id'] ?>" class="text-left bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 hover:bg-slate-100">
                        <span class="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded"><?= h($ev['category'] ?: 'Event') ?></span>
                        <h4 class="font-bold text-slate-900 text-sm"><?= h($ev['title']) ?></h4>
                        <p class="text-xs text-slate-600"><?= h(pretty_d($ev['event_date'])) ?> at <?= h($ev['event_time']) ?> — <?= h($ev['location']) ?></p>
                    </button>
                <?php endforeach; ?>
                <?php foreach ($meetings as $mt): ?>
                    <button type="button" data-open="mtModal-<?= (int)$mt['id'] ?>" class="text-left bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 hover:bg-slate-100">
                        <span class="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">Meeting</span>
                        <h4 class="font-bold text-slate-900 text-sm"><?= h($mt['title']) ?></h4>
                        <p class="text-xs text-slate-600"><?= h(pretty_d($mt['meeting_date'])) ?> at <?= h($mt['meeting_time']) ?> — <?= h($mt['venue']) ?></p>
                    </button>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Compact diary detail modals -->
        <?php foreach ($events as $ev): ?>
            <div id="evModal-<?= (int)$ev['id'] ?>" class="modal-backdrop hidden">
                <div class="modal-panel sm">
                    <div class="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
                        <h3 class="text-xs font-black text-slate-900"><?= h($ev['title']) ?></h3>
                        <button type="button" data-close="evModal-<?= (int)$ev['id'] ?>" class="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
                    </div>
                    <div class="p-4 space-y-2 text-xs">
                        <div class="flex justify-between"><span class="text-slate-500">Category</span><span class="font-bold"><?= h($ev['category']) ?></span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Date</span><span class="font-bold"><?= h(pretty_d($ev['event_date'])) ?> <?= h($ev['event_time']) ?></span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Location</span><span class="font-bold"><?= h($ev['location']) ?></span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Host</span><span class="font-bold"><?= h($ev['host']) ?></span></div>
                        <p class="text-slate-600 pt-1"><?= h($ev['description']) ?></p>
                        <?php if (!empty($ev['linked_project_id']) && isset($projectsById[(int)$ev['linked_project_id']])): ?>
                            <div class="pt-2 border-t border-slate-100">
                                <div class="text-[10px] font-black uppercase text-slate-400 mb-1">Linked project</div>
                                <?= project_link($projectsById[(int)$ev['linked_project_id']]) ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
        <?php foreach ($meetings as $mt): ?>
            <div id="mtModal-<?= (int)$mt['id'] ?>" class="modal-backdrop hidden">
                <div class="modal-panel sm">
                    <div class="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
                        <h3 class="text-xs font-black text-slate-900"><?= h($mt['title']) ?></h3>
                        <button type="button" data-close="mtModal-<?= (int)$mt['id'] ?>" class="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
                    </div>
                    <div class="p-4 space-y-2 text-xs">
                        <div class="flex justify-between"><span class="text-slate-500">Date</span><span class="font-bold"><?= h(pretty_d($mt['meeting_date'])) ?> <?= h($mt['meeting_time']) ?></span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Venue</span><span class="font-bold"><?= h($mt['venue']) ?></span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Chair</span><span class="font-bold"><?= h($mt['chairperson']) ?></span></div>
                        <div class="pt-1"><div class="text-[10px] font-black uppercase text-slate-400 mb-1">Agenda</div><p class="text-slate-600"><?= h($mt['agenda']) ?></p></div>
                        <div><div class="text-[10px] font-black uppercase text-slate-400 mb-1">Decisions</div><p class="text-slate-600"><?= h($mt['decisions']) ?></p></div>
                        <?php if (!empty($mt['linked_project_id']) && isset($projectsById[(int)$mt['linked_project_id']])): ?>
                            <div class="pt-2 border-t border-slate-100">
                                <div class="text-[10px] font-black uppercase text-slate-400 mb-1">Linked project</div>
                                <?= project_link($projectsById[(int)$mt['linked_project_id']]) ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>

    <?php elseif ($active_tab === 'project'): ?>
        <?php if (!$detailProject): ?>
            <div class="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-600">Project not found. <a href="?tab=projects" class="text-blue-700 font-bold">Back to projects</a></div>
        <?php else: $dp = $detailProject; ?>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <a href="?tab=projects" class="text-[11px] font-bold text-blue-700 hover:underline">&larr; Back to Projects</a>
                    <h2 class="text-lg font-black text-slate-900 mt-1"><?= h($dp['sub_programme']) ?></h2>
                    <div class="text-xs text-slate-500"><?= h($dp['programme_title']) ?> — <span class="font-mono"><?= h($dp['project_code']) ?></span></div>
                </div>
                <span class="<?= status_classes($dp['status']) ?> px-3 py-1 rounded font-bold text-xs"><?= h($dp['status']) ?></span>
            </div>

            <!-- ACTION BOARD (read-only, derived from KPIs) -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 class="text-sm font-black text-slate-900">Action Board</h3>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Read-only · Calculated from KPIs</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <?php
                    $cols = ['ON TRACK' => [], 'STALLED' => [], 'COMPLETED' => []];
                    foreach ($detailActions as $a) {
                        $s = strtoupper(trim($a['status']));
                        if (!isset($cols[$s])) $s = 'ON TRACK';
                        $cols[$s][] = $a;
                    }
                    $colStyles = [
                        'ON TRACK' => 'border-emerald-300 bg-emerald-50',
                        'STALLED' => 'border-red-300 bg-red-50',
                        'COMPLETED' => 'border-blue-300 bg-blue-50',
                    ];
                    ?>
                    <?php foreach ($cols as $label => $items): ?>
                        <div class="rounded-lg border <?= $colStyles[$label] ?> p-3">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-[10px] font-black uppercase tracking-wider text-slate-600"><?= $label ?></span>
                                <span class="text-[10px] font-black bg-white/70 rounded px-1.5"><?= count($items) ?></span>
                            </div>
                            <div class="space-y-2">
                                <?php if (empty($items)): ?>
                                    <div class="text-[11px] text-slate-400">None.</div>
                                <?php else: foreach ($items as $a): ?>
                                    <a href="?tab=actions&id=<?= (int)$a['id'] ?>" class="block bg-white rounded border border-slate-200 p-2 hover:shadow-sm">
                                        <div class="text-[10px] font-mono font-bold text-blue-700"><?= h($a['ref_no']) ?></div>
                                        <div class="text-xs font-semibold text-slate-800"><?= h($a['title']) ?></div>
                                        <div class="text-[10px] text-slate-500 mt-0.5"><?= h($a['person_responsible']) ?> · <?= h($a['timeline']) ?></div>
                                    </a>
                                <?php endforeach; endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Linked KPIs (read-only) -->
                <div class="pt-2">
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Linked KPIs driving this board</div>
                    <?php if (empty($detailKpis)): ?>
                        <div class="text-xs text-slate-500">No linked KPIs; progress falls back to recorded status.</div>
                    <?php else: ?>
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                                <tr><th class="py-2 px-3">Code</th><th class="py-2 px-3">KPI</th><th class="py-2 px-3">Weight</th><th class="py-2 px-3 text-center">Achievement</th></tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <?php foreach ($detailKpis as $k): ?>
                                    <tr>
                                        <td class="py-2 px-3 font-mono font-bold text-blue-700"><?= h($k['code']) ?></td>
                                        <td class="py-2 px-3"><?= h($k['kpi_name']) ?></td>
                                        <td class="py-2 px-3 font-mono"><?= $k['category_weight'] ?>%</td>
                                        <td class="py-2 px-3 text-center"><span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded"><?= (int)$k['current_achievement'] ?>%</span></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>

            <!-- PROGRESS (bottom, automatic, not editable) -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 class="text-sm font-black text-slate-900">Progress</h3>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Auto-captured · Not editable</span>
                </div>
                <div class="flex flex-wrap items-center gap-6">
                    <div>
                        <div class="text-4xl font-black text-blue-700 font-mono"><?= (int)$detailProgress['pct'] ?>%</div>
                        <div class="text-[11px] text-slate-500 mt-1">Calculated from <?= count($detailKpis) ?> KPI<?= count($detailKpis) === 1 ? '' : 's' ?><?= $detailProgress['derived'] ? '' : ' (fallback: recorded status)' ?></div>
                    </div>
                    <div class="flex-1 min-w-[220px]">
                        <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div class="bg-[#40B5AD] h-full rounded-full" style="width: <?= (int)$detailProgress['pct'] ?>%;"></div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div class="bg-slate-50 rounded-lg p-3"><div class="text-[10px] font-black uppercase text-slate-400">Title</div><div class="font-bold text-slate-800 mt-0.5"><?= h($dp['sub_programme']) ?></div></div>
                    <div class="bg-slate-50 rounded-lg p-3"><div class="text-[10px] font-black uppercase text-slate-400">Captured by</div><div class="font-bold text-slate-800 mt-0.5"><?= h($ME['full_name'] ?? 'System') ?></div></div>
                    <div class="bg-slate-50 rounded-lg p-3"><div class="text-[10px] font-black uppercase text-slate-400">Capture</div><div class="font-bold text-emerald-700 mt-0.5">Automatic (from KPIs)</div></div>
                </div>

                <?php if (!empty($progressRows)): ?>
                <div class="pt-2">
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Progress history</div>
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                            <tr><th class="py-2 px-3">Period</th><th class="py-2 px-3">Target</th><th class="py-2 px-3">Achieved</th><th class="py-2 px-3">Progress</th><th class="py-2 px-3">Recorded by</th></tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($progressRows as $row): ?>
                                <tr>
                                    <td class="py-2 px-3 font-bold"><?= h($row['period_month']) ?></td>
                                    <td class="py-2 px-3 font-mono"><?= h($row['target_pct']) ?>%</td>
                                    <td class="py-2 px-3 font-mono"><?= h($row['achieved_pct']) ?>%</td>
                                    <td class="py-2 px-3"><span class="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded"><?= (int)$row['progress_percentage'] ?>%</span></td>
                                    <td class="py-2 px-3 text-slate-600"><?= h($row['recorded_by']) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                <?php endif; ?>
            </div>
        </div>
        <?php endif; ?>

    <?php elseif ($active_tab === 'actions'): ?>
        <?php if ($detailAction): $da = $detailAction; $dview = $_GET['view'] ?? 'details'; ?>
            <div class="space-y-4">
                <div>
                    <a href="?tab=actions" class="text-[11px] font-bold text-blue-700 hover:underline">&larr; Back to Action Points</a>
                    <div class="flex items-center gap-3 mt-1">
                        <h2 class="text-lg font-black text-slate-900"><?= h($da['ref_no']) ?> — <?= h($da['title']) ?></h2>
                        <span class="<?= status_classes($da['status']) ?> px-2 py-0.5 rounded font-bold text-[10px]"><?= h($da['status']) ?></span>
                    </div>
                </div>

                <!-- Detail tabs -->
                <div class="bg-white rounded-xl border border-slate-200 px-2 flex space-x-1">
                    <a href="?tab=actions&id=<?= (int)$da['id'] ?>&view=details" class="tablink <?= $dview !== 'changes' ? 'active' : 'text-slate-600' ?>">Action Details</a>
                    <a href="?tab=actions&id=<?= (int)$da['id'] ?>&view=changes" class="tablink <?= $dview === 'changes' ? 'active' : 'text-slate-600' ?>">Change Details &amp; Approval History<?php if (pending_for_action($pendingChanges, (int)$da['id'])): ?><span class="ml-1 bg-amber-500 text-white rounded-full px-1.5 text-[9px]"><?= pending_for_action($pendingChanges, (int)$da['id']) ?></span><?php endif; ?></a>
                </div>

                <?php if ($dview === 'changes'): ?>
                    <!-- Change Details & Approval History -->
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 class="text-sm font-black text-slate-900">Change Details &amp; Approval History</h3>
                            <button type="button" data-open="changeModal-<?= (int)$da['id'] ?>" class="bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold px-3 py-1.5 rounded">Request Change</button>
                        </div>
                        <?php if (empty($actionChanges)): ?>
                            <div class="text-xs text-slate-500">No changes requested yet.</div>
                        <?php else: ?>
                            <div class="space-y-3">
                                <?php foreach ($actionChanges as $c): ?>
                                    <div class="border border-slate-200 rounded-lg p-3">
                                        <div class="flex items-center justify-between">
                                            <div class="text-xs font-bold text-slate-800"><?= h($c['field']) ?>: <span class="text-slate-500">"<?= h($c['old_value']) ?>"</span> &rarr; <span class="text-blue-700">"<?= h($c['new_value']) ?>"</span></div>
                                            <span class="<?= status_classes($c['status']) ?> px-2 py-0.5 rounded font-bold text-[10px]"><?= h($c['status']) ?></span>
                                        </div>
                                        <div class="text-[11px] text-slate-600 mt-1"><span class="font-bold">Reason:</span> <?= h($c['reason']) ?></div>
                                        <div class="text-[10px] text-slate-400 mt-1">Requested by <?= h($c['requested_by']) ?> on <?= h(pretty_dt($c['requested_at'])) ?></div>
                                        <?php if (strtolower($c['status']) === 'pending' && is_approver($ME)): ?>
                                            <div class="flex gap-2 mt-2">
                                                <form method="post"><input type="hidden" name="action" value="change_approve"><input type="hidden" name="csrf" value="<?= h($CSRF) ?>"><input type="hidden" name="change_id" value="<?= (int)$c['id'] ?>"><button class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded">Approve</button></form>
                                                <form method="post"><input type="hidden" name="action" value="change_reject"><input type="hidden" name="csrf" value="<?= h($CSRF) ?>"><input type="hidden" name="change_id" value="<?= (int)$c['id'] ?>"><button class="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1 rounded">Reject</button></form>
                                            </div>
                                        <?php elseif (strtolower($c['status']) !== 'pending'): ?>
                                            <div class="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 inline-block">
                                                <?= h($c['status']) ?> by <?= h($c['approved_by']) ?> on <?= h(pretty_dt($c['approved_at'])) ?>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Request Change modal -->
                    <div id="changeModal-<?= (int)$da['id'] ?>" class="modal-backdrop hidden">
                        <div class="modal-panel sm">
                            <div class="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
                                <h3 class="text-xs font-black text-slate-900">Request Change — <?= h($da['ref_no']) ?></h3>
                                <button type="button" data-close="changeModal-<?= (int)$da['id'] ?>" class="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
                            </div>
                            <form method="post" class="p-4 space-y-3">
                                <input type="hidden" name="action" value="action_request_change">
                                <input type="hidden" name="csrf" value="<?= h($CSRF) ?>">
                                <input type="hidden" name="action_id" value="<?= (int)$da['id'] ?>">
                                <label class="text-[11px] font-bold text-slate-600 block">Field to change
                                    <select name="field" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                                        <option value="Status">Status</option>
                                        <option value="Title">Title</option>
                                        <option value="Description">Description</option>
                                        <option value="Person Responsible">Person Responsible</option>
                                        <option value="Timeline">Timeline</option>
                                        <option value="Resolution Notes">Resolution Notes</option>
                                    </select>
                                </label>
                                <label class="text-[11px] font-bold text-slate-600 block">New value
                                    <input required name="new_value" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs">
                                </label>
                                <label class="text-[11px] font-bold text-slate-600 block">Reason for change
                                    <textarea required name="reason" rows="3" class="mt-1 w-full border border-slate-300 rounded px-2 py-1.5 text-xs"></textarea>
                                </label>
                                <div class="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">Changes are set to PENDING APPROVAL and require an approver.</div>
                                <div class="flex justify-end gap-2 pt-1">
                                    <button type="button" data-close="changeModal-<?= (int)$da['id'] ?>" class="px-3 py-1.5 rounded text-xs font-bold bg-slate-100 text-slate-700">Cancel</button>
                                    <button type="submit" class="px-3 py-1.5 rounded text-xs font-bold bg-blue-700 text-white">Submit for approval</button>
                                </div>
                            </form>
                        </div>
                    </div>
                <?php else: ?>
                    <!-- Action Details (read-only) -->
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
                        <h3 class="text-sm font-black text-slate-900 border-b border-slate-200 pb-3">Action Details</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div><div class="text-[10px] font-black uppercase text-slate-400">Reference</div><div class="font-mono font-bold text-blue-700"><?= h($da['ref_no']) ?></div></div>
                            <div><div class="text-[10px] font-black uppercase text-slate-400">Status</div><div class="font-bold"><?= h($da['status']) ?></div></div>
                            <div><div class="text-[10px] font-black uppercase text-slate-400">Person Responsible</div><div class="font-bold"><?= h($da['person_responsible']) ?></div></div>
                            <div><div class="text-[10px] font-black uppercase text-slate-400">Timeline</div><div class="font-bold"><?= h($da['timeline']) ?></div></div>
                            <?php if (!empty($da['project_id']) && isset($projectsById[(int)$da['project_id']])): ?>
                                <div class="sm:col-span-2"><div class="text-[10px] font-black uppercase text-slate-400">Linked project</div><?= project_link($projectsById[(int)$da['project_id']]) ?></div>
                            <?php endif; ?>
                        </div>
                        <div class="pt-2 border-t border-slate-100"><div class="text-[10px] font-black uppercase text-slate-400 mb-1">Description</div><p class="text-xs text-slate-600"><?= h($da['description']) ?></p></div>
                        <div><div class="text-[10px] font-black uppercase text-slate-400 mb-1">Resolution Notes</div><p class="text-xs text-slate-600"><?= h($da['resolution_notes']) ?></p></div>
                        <div class="text-[10px] text-slate-400">Read-only. Changes must be requested via the Change Details tab and approved.</div>
                    </div>
                <?php endif; ?>
            </div>
        <?php else: ?>
            <!-- Action Points list -->
            <div class="space-y-4">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                    <h2 class="text-base font-black text-slate-900">Action Points Tracker</h2>
                    <span class="text-[11px] text-slate-500">Read-only · changes require approval</span>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                            <tr><th class="py-3 px-4">Ref</th><th class="py-3 px-3">Title</th><th class="py-3 px-3">Responsible</th><th class="py-3 px-3">Timeline</th><th class="py-3 px-3">Status</th><th class="py-3 px-3 text-center">Changes</th></tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($actionPoints as $a): $pc = pending_for_action($pendingChanges, (int)$a['id']); ?>
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-4 font-mono font-bold text-blue-700"><?= h($a['ref_no']) ?></td>
                                    <td class="py-3 px-3 font-semibold text-slate-800"><a href="?tab=actions&id=<?= (int)$a['id'] ?>" class="hover:underline"><?= h($a['title']) ?></a></td>
                                    <td class="py-3 px-3 text-slate-600"><?= h($a['person_responsible']) ?></td>
                                    <td class="py-3 px-3 text-slate-600"><?= h($a['timeline']) ?></td>
                                    <td class="py-3 px-3"><span class="<?= status_classes($a['status']) ?> px-2 py-0.5 rounded font-bold text-[10px]"><?= h($a['status']) ?></span></td>
                                    <td class="py-3 px-3 text-center">
                                        <?php if ($pc): ?><span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]"><?= $pc ?> pending</span><?php else: ?><span class="text-slate-300">—</span><?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>

    <?php elseif ($active_tab === 'notifications'): ?>
        <?php if (!can_view_notifications($ME)): ?>
            <div class="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-600">You do not have permission to view notifications.</div>
        <?php else: ?>
        <div class="space-y-4">
            <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <h2 class="text-base font-black text-slate-900">Notifications</h2>
                <form method="post"><input type="hidden" name="action" value="notif_read_all"><input type="hidden" name="csrf" value="<?= h($CSRF) ?>"><button class="text-[11px] font-bold text-blue-700 hover:underline">Mark all as read</button></form>
            </div>

            <!-- Pending approvals panel -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
                <h3 class="text-sm font-black text-slate-900 border-b border-slate-200 pb-3">Pending Approvals</h3>
                <?php $anyPending = false; foreach ($pendingChanges as $c): if (strtolower($c['status']) !== 'pending') continue; $anyPending = true; ?>
                    <div class="border border-amber-200 bg-amber-50 rounded-lg p-3">
                        <div class="flex items-center justify-between">
                            <div class="text-xs font-bold text-slate-800"><?= h($c['ref_no']) ?> — <?= h($c['field']) ?>: "<?= h($c['old_value']) ?>" &rarr; "<?= h($c['new_value']) ?>"</div>
                            <a href="?tab=actions&id=<?= (int)$c['action_id'] ?>&view=changes" class="text-[10px] font-bold text-blue-700 hover:underline">Review</a>
                        </div>
                        <div class="text-[11px] text-slate-600 mt-1">Reason: <?= h($c['reason']) ?></div>
                        <div class="text-[10px] text-slate-400 mt-1">Requested by <?= h($c['requested_by']) ?> on <?= h(pretty_dt($c['requested_at'])) ?></div>
                    </div>
                <?php endforeach; if (!$anyPending): ?>
                    <div class="text-xs text-slate-500">No pending approvals.</div>
                <?php endif; ?>
            </div>

            <!-- All notifications (greyed when read) -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-black text-slate-700 uppercase tracking-wide">All Notifications</div>
                <div class="divide-y divide-slate-100">
                    <?php if (empty($notifications)): ?>
                        <div class="px-4 py-4 text-xs text-slate-500">No notifications.</div>
                    <?php else: foreach ($notifications as $n): ?>
                        <form method="post" class="block">
                            <input type="hidden" name="action" value="notif_read">
                            <input type="hidden" name="csrf" value="<?= h($CSRF) ?>">
                            <input type="hidden" name="notif_id" value="<?= (int)$n['id'] ?>">
                            <button type="submit" class="w-full text-left px-4 py-3 hover:bg-slate-50 <?= (int)$n['is_read'] ? 'opacity-55 bg-slate-50' : '' ?>">
                                <div class="flex items-center gap-2">
                                    <span class="text-[9px] font-black px-1.5 py-0.5 rounded <?= severity_classes($n['severity']) ?>"><?= h(strtoupper($n['severity'])) ?></span>
                                    <span class="text-xs font-bold text-slate-800"><?= h($n['title']) ?></span>
                                    <span class="text-[10px] text-slate-400 ml-auto font-mono"><?= h(pretty_dt($n['created_at'])) ?></span>
                                    <?php if (!(int)$n['is_read']): ?><span class="w-2 h-2 rounded-full bg-red-500"></span><?php endif; ?>
                                </div>
                                <div class="text-[11px] text-slate-500 mt-1"><?= h($n['message']) ?></div>
                                <div class="text-[10px] text-blue-600 font-bold mt-1"><?= (int)$n['is_read'] ? 'Read — click to view details in audit logs' : 'Click to view details in audit logs' ?></div>
                            </button>
                        </form>
                    <?php endforeach; endif; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>

    <?php elseif ($active_tab === 'audit-logs'): ?>
        <div class="space-y-4">
            <?php if ($focusNotif): ?>
                <div class="bg-white rounded-xl shadow-sm border border-blue-200 p-5 space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="text-[9px] font-black px-1.5 py-0.5 rounded <?= severity_classes($focusNotif['severity']) ?>"><?= h(strtoupper($focusNotif['severity'])) ?></span>
                        <h3 class="text-sm font-black text-slate-900"><?= h($focusNotif['title']) ?></h3>
                        <span class="text-[10px] text-slate-400 ml-auto font-mono"><?= h(pretty_dt($focusNotif['created_at'])) ?></span>
                    </div>
                    <p class="text-xs text-slate-600"><?= h($focusNotif['message']) ?></p>
                    <div class="text-[11px] text-slate-500">Module: <span class="font-bold"><?= h($focusNotif['module']) ?></span> · Status: <span class="font-bold"><?= (int)$focusNotif['is_read'] ? 'Read' : 'Unread' ?></span></div>
                    <?php
                    $relLog = null;
                    if (!empty($focusNotif['related_log_id'])) {
                        foreach ($auditLogs as $lg) { if ((int)$lg['id'] === (int)$focusNotif['related_log_id']) { $relLog = $lg; break; } }
                    }
                    ?>
                    <?php if ($relLog): ?>
                        <div class="mt-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
                            <div class="text-[10px] font-black uppercase text-slate-400 mb-1">Related audit entry #<?= (int)$relLog['id'] ?></div>
                            <div class="text-xs text-slate-700"><span class="font-bold"><?= h($relLog['action']) ?></span> · <?= h($relLog['module']) ?> · <?= h($relLog['user_name']) ?> · <?= h(pretty_dt($relLog['timestamp'])) ?></div>
                            <div class="text-[11px] text-slate-600 mt-1"><?= h($relLog['details']) ?></div>
                        </div>
                    <?php endif; ?>
                    <div><a href="?tab=notifications" class="text-[11px] font-bold text-blue-700 hover:underline">&larr; Back to notifications</a></div>
                </div>
            <?php endif; ?>

            <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <h2 class="text-base font-black text-slate-900">Audit Logs</h2>
                <span class="text-[11px] text-slate-500">Immutable record of all system changes</span>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table class="w-full text-xs text-left min-w-[800px]">
                    <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide">
                        <tr><th class="py-3 px-3">#</th><th class="py-3 px-3">Time</th><th class="py-3 px-3">User</th><th class="py-3 px-3">Action</th><th class="py-3 px-3">Module</th><th class="py-3 px-3">Details</th><th class="py-3 px-3">IP</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($auditLogs as $lg): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="py-2 px-3 font-mono text-slate-400"><?= (int)$lg['id'] ?></td>
                                <td class="py-2 px-3 font-mono text-slate-600 whitespace-nowrap"><?= h(pretty_dt($lg['timestamp'])) ?></td>
                                <td class="py-2 px-3 font-semibold text-slate-800"><?= h($lg['user_name']) ?></td>
                                <td class="py-2 px-3"><span class="<?= status_classes($lg['action']) ?> px-2 py-0.5 rounded font-bold text-[10px] uppercase"><?= h($lg['action']) ?></span></td>
                                <td class="py-2 px-3 text-slate-600"><?= h($lg['module']) ?></td>
                                <td class="py-2 px-3 text-slate-600"><?= h($lg['details']) ?></td>
                                <td class="py-2 px-3 font-mono text-slate-400"><?= h($lg['ip_address']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
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

<script>
(function () {
    // Notification dropdown toggle
    document.querySelectorAll('[data-toggle="notif"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var menu = document.getElementById('notif');
            if (menu) menu.classList.toggle('hidden');
        });
    });
    document.addEventListener('click', function (e) {
        var menu = document.getElementById('notif');
        if (menu && !menu.classList.contains('hidden')) {
            if (!menu.contains(e.target)) menu.classList.add('hidden');
        }
    });

    // Modal open / close
    document.querySelectorAll('[data-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-open');
            var m = document.getElementById(id);
            if (m) m.classList.remove('hidden');
        });
    });
    document.querySelectorAll('[data-close]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-close');
            var m = document.getElementById(id);
            if (m) m.classList.add('hidden');
        });
    });
    // Backdrop click + Escape close
    document.querySelectorAll('.modal-backdrop').forEach(function (bd) {
        bd.addEventListener('click', function (e) {
            if (e.target === bd) bd.classList.add('hidden');
        });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop').forEach(function (bd) { bd.classList.add('hidden'); });
        }
    });
})();
</script>
</body>
</html>
