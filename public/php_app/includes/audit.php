<?php
/**
 * audit.php — audit trail + notification helpers
 */
require_once __DIR__ . '/auth.php';

/** Write an audit log entry and return its id. */
function log_audit(string $action, string $module, string $details, $recordId = null): int
{
    global $pdo;
    if (!$pdo) return 0;

    $u = current_user();
    $stmt = $pdo->prepare(
        'INSERT INTO audit_logs (user_name, email, action, module, record_id, details, ip_address, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())'
    );
    $stmt->execute([
        $u['full_name'] ?? 'System',
        $u['email'] ?? 'system@health.go.ke',
        $action,
        $module,
        $recordId !== null ? (string)$recordId : null,
        $details,
        $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
    ]);
    return (int)$pdo->lastInsertId();
}

/** Create a persistent notification. */
function push_notification(string $title, string $message, string $module, string $severity = 'info', $relatedLogId = null): int
{
    global $pdo;
    if (!$pdo) return 0;

    $stmt = $pdo->prepare(
        'INSERT INTO notifications (title, message, module, severity, is_read, related_log_id, created_at)
         VALUES (?, ?, ?, ?, 0, ?, NOW())'
    );
    $stmt->execute([$title, $message, $module, $severity, $relatedLogId !== null ? (int)$relatedLogId : null]);
    return (int)$pdo->lastInsertId();
}

/** Unread notification count. */
function unread_notification_count(): int
{
    global $pdo;
    if (!$pdo) return 0;
    try {
        return (int)$pdo->query('SELECT COUNT(*) FROM notifications WHERE is_read = 0')->fetchColumn();
    } catch (Throwable $e) {
        return 0;
    }
}

/** Latest notifications for the header dropdown. */
function latest_notifications(int $limit = 8): array
{
    global $pdo;
    if (!$pdo) return [];
    try {
        $stmt = $pdo->prepare('SELECT * FROM notifications ORDER BY created_at DESC, id DESC LIMIT ' . (int)$limit);
        $stmt->execute();
        return $stmt->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
}
