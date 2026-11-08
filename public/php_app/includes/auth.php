<?php
/**
 * auth.php — session, login and role-based access helpers
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../db.php';

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function is_logged_in(): bool
{
    return !empty($_SESSION['user']);
}

function require_login(): void
{
    if (!is_logged_in()) {
        redirect('index.php?page=login');
    }
}

/** Capability check against the logged-in user record. */
function can(string $capability): bool
{
    $u = current_user();
    if (!$u) return false;
    if (!empty($u['is_admin'])) return true;
    return !empty($u[$capability]);
}

function is_approver(): bool
{
    $u = current_user();
    return $u && (!empty($u['is_admin']) || !empty($u['can_approve']));
}

/**
 * Attempt login. Returns [bool ok, string message].
 */
function attempt_login(string $email, string $password): array
{
    global $pdo;
    if (!$pdo) return [false, 'Database is not available.'];

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([trim($email)]);
    $user = $stmt->fetch();

    if (!$user) return [false, 'No account found for that email address.'];
    if (empty($user['is_active'])) return [false, 'This account has been deactivated.'];

    $hash = $user['password_hash'] ?? '';
    $ok = $hash ? password_verify($password, $hash) : ($password === APP_DEMO_PASSWORD);
    if (!$ok) return [false, 'Incorrect password.'];

    // Record last login and refresh the timestamp.
    $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);
    $user['last_login'] = date('Y-m-d H:i:s');

    unset($user['password_hash']);
    $_SESSION['user'] = $user;

    require_once __DIR__ . '/audit.php';
    log_audit('login', 'Authentication', 'User logged in successfully.');

    return [true, 'Welcome back, ' . $user['full_name'] . '.'];
}

function logout_user(): void
{
    require_once __DIR__ . '/audit.php';
    if (is_logged_in()) {
        log_audit('logout', 'Authentication', 'User signed out.');
    }
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/** Users allowed to see the notification centre. */
function can_view_notifications(): bool
{
    $u = current_user();
    if (!$u) return false;
    return !empty($u['is_admin']) || !empty($u['can_approve'])
        || stripos($u['role'] ?? '', 'principal') !== false
        || stripos($u['role'] ?? '', 'director') !== false;
}
