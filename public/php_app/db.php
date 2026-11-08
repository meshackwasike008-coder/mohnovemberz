<?php
// db.php - Database Connection + shared helpers for PP-SDOMS (Standalone PHP / cPanel)
// Edit the four credentials below to match your cPanel MySQL database.

$host = 'localhost';
$dbname = 'moh_sdoms_db';
$username = 'root';
$password = '';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
date_default_timezone_set('Africa/Nairobi');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Fallback error message if database is not yet created
    $db_error = "Database Connection Error: " . $e->getMessage() . ". Please import schema.sql via phpMyAdmin.";
}

/* ------------------------------------------------------------------ */
/* Generic helpers                                                     */
/* ------------------------------------------------------------------ */

function h($v): string
{
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

/** Format an amount in millions, e.g. 420.00M */
function m_fmt($v, int $dec = 2): string
{
    return number_format((float)$v / 1000000, $dec) . 'M';
}

/** Millions input -> KES */
function m_to_kes($m): float
{
    return round(((float)$m) * 1000000, 2);
}

function now_stamp(): string
{
    return date('Y-m-d H:i:s');
}

function pretty_dt($d): string
{
    if (!$d) return '—';
    $ts = strtotime((string)$d);
    return $ts ? date('d M Y, H:i', $ts) : (string)$d;
}

function pretty_d($d): string
{
    if (!$d) return '—';
    $ts = strtotime((string)$d);
    return $ts ? date('d M Y', $ts) : (string)$d;
}

function set_flash(string $type, string $msg): void
{
    $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
}

function take_flash(): ?array
{
    if (empty($_SESSION['flash'])) return null;
    $f = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $f;
}

function redirect(string $url): void
{
    header('Location: ' . $url);
    exit;
}

/* ------------------------------------------------------------------ */
/* Current user (session-based account context)                        */
/* ------------------------------------------------------------------ */

function current_user(): ?array
{
    global $pdo;
    if (!$pdo) return null;
    $uid = (int)($_SESSION['uid'] ?? 1);
    try {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$uid]);
        $u = $stmt->fetch();
        if (!$u) {
            $u = $pdo->query('SELECT * FROM users WHERE is_active = 1 ORDER BY id ASC LIMIT 1')->fetch();
        }
        return $u ?: null;
    } catch (Throwable $e) {
        return null;
    }
}

function is_approver(?array $u = null): bool
{
    $u = $u ?? current_user();
    if (!$u) return false;
    return !empty($u['is_admin']) || !empty($u['can_approve'])
        || stripos($u['role'] ?? '', 'principal') !== false
        || stripos($u['role'] ?? '', 'director general') !== false;
}

function can_view_notifications(?array $u = null): bool
{
    $u = $u ?? current_user();
    if (!$u) return false;
    return !empty($u['is_admin']) || !empty($u['can_approve'])
        || stripos($u['role'] ?? '', 'principal') !== false
        || stripos($u['role'] ?? '', 'director') !== false;
}

/* ------------------------------------------------------------------ */
/* Audit + notifications                                               */
/* ------------------------------------------------------------------ */

function audit_log(string $action, string $module, string $details, $recordId = null): int
{
    global $pdo;
    if (!$pdo) return 0;
    $u = current_user();
    $stmt = $pdo->prepare(
        'INSERT INTO audit_logs (user_name, email, action, module, record_id, details, ip_address, timestamp)
         VALUES (?,?,?,?,?,?,?,?)'
    );
    $stmt->execute([
        $u['full_name'] ?? 'System',
        $u['email'] ?? 'system@health.go.ke',
        $action,
        $module,
        $recordId !== null ? (string)$recordId : null,
        $details,
        $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        now_stamp(),
    ]);
    return (int)$pdo->lastInsertId();
}

function notify(string $title, string $message, string $module, string $severity = 'info', $relatedLogId = null): int
{
    global $pdo;
    if (!$pdo) return 0;
    $stmt = $pdo->prepare(
        'INSERT INTO notifications (title, message, module, severity, is_read, related_log_id, created_at)
         VALUES (?,?,?,?,0,?,?)'
    );
    $stmt->execute([$title, $message, $module, $severity, $relatedLogId, now_stamp()]);
    return (int)$pdo->lastInsertId();
}

function unread_notifications(): int
{
    global $pdo;
    if (!$pdo) return 0;
    try {
        return (int)$pdo->query('SELECT COUNT(*) FROM notifications WHERE is_read = 0')->fetchColumn();
    } catch (Throwable $e) {
        return 0;
    }
}

function latest_notifications(int $limit = 6): array
{
    global $pdo;
    if (!$pdo) return [];
    try {
        $stmt = $pdo->prepare('SELECT * FROM notifications ORDER BY is_read ASC, created_at DESC, id DESC LIMIT ' . (int)$limit);
        $stmt->execute();
        return $stmt->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
}

/* ------------------------------------------------------------------ */
/* KPI-derived progress (read-only, used by Action Board + Progress)   */
/* ------------------------------------------------------------------ */

/**
 * Calculate a project's progress from its linked KPIs.
 * Returns ['pct' => int, 'linked' => array, 'derived' => bool].
 */
function project_progress(array $project, array $allKpis): array
{
    $codes = array_filter(array_map('trim', explode(',', (string)($project['linked_sub_kpi_codes'] ?? ''))));
    $linked = [];
    $weighted = 0.0;
    $weightSum = 0.0;

    foreach ($allKpis as $k) {
        if ($codes && !in_array($k['code'], $codes, true)) continue;
        $ach = isset($k['current_achievement']) ? (float)$k['current_achievement'] : null;
        if ($ach === null) continue;
        $w = (float)($k['category_weight'] ?? 0);
        if ($w <= 0) $w = 1;
        $linked[] = $k;
        $weighted += $ach * $w;
        $weightSum += $w;
    }

    if ($weightSum > 0) {
        return ['pct' => (int)round($weighted / $weightSum), 'linked' => $linked, 'derived' => true];
    }

    // Fallback to the stored progress_status (e.g. "22%")
    $pct = (int)preg_replace('/[^0-9]/', '', (string)($project['progress_status'] ?? '0'));
    return ['pct' => $pct, 'linked' => $linked, 'derived' => false];
}

/** Badge classes for a status string. */
function status_classes(string $status): string
{
    $s = strtolower(trim($status));
    if (str_contains($s, 'complet') || $s === 'approved' || $s === 'on track') return 'bg-emerald-100 text-emerald-800';
    if (str_contains($s, 'delay') || str_contains($s, 'stall') || $s === 'rejected') return 'bg-red-100 text-red-700';
    if (str_contains($s, 'pending') || str_contains($s, 'planning')) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
}

/** Severity classes for notifications. */
function severity_classes(string $sev): string
{
    return match ($sev) {
        'approval' => 'bg-amber-100 text-amber-800',
        'warning'  => 'bg-red-100 text-red-700',
        'success'  => 'bg-emerald-100 text-emerald-800',
        default    => 'bg-blue-100 text-blue-800',
    };
}
