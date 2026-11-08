<?php
/**
 * helpers.php — shared view/formatting helpers
 */

/** HTML-escape. */
function h($v): string
{
    return htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8');
}

/** Format a full KES amount. */
function money($v): string
{
    return 'KES ' . number_format((float)($v ?? 0), 2);
}

/** Convert KES -> millions, formatted. */
function kes_m($v, int $dec = 2): string
{
    return number_format(((float)($v ?? 0)) / 1000000, $dec);
}

/** Millions -> KES. */
function m_to_kes($m): float
{
    return round(((float)$m) * 1000000, 2);
}

/** Current timestamp string used across the app. */
function now_stamp(): string
{
    return date('Y-m-d H:i:s');
}

/** Pretty date. */
function pretty_date($d): string
{
    if (!$d) return '—';
    $t = strtotime($d);
    return $t ? date('d M Y', $t) : h($d);
}

/** Pretty datetime. */
function pretty_datetime($d): string
{
    if (!$d) return '—';
    $t = strtotime($d);
    return $t ? date('d M Y, H:i', $t) : h($d);
}

/** Redirect helper. */
function redirect(string $url): void
{
    header('Location: ' . $url);
    exit;
}

/** Flash messages (session-backed). */
function set_flash(string $type, string $message): void
{
    $_SESSION['flash'][] = ['type' => $type, 'message' => $message];
}

function get_flashes(): array
{
    $f = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $f;
}

/**
 * Calculate a project's progress from linked performance KPIs.
 * Weighted by sub_kpi_weight; falls back to the stored progress_status.
 *
 * @return array{pct: float, is_derived: bool, linked: array}
 */
function calc_project_progress(array $project, array $kpis): array
{
    $codes = array_filter(array_map('trim', explode(',', (string)($project['linked_sub_kpi_codes'] ?? ''))));
    $linked = [];
    $weighted = 0.0;
    $weightSum = 0.0;

    if ($codes) {
        foreach ($kpis as $k) {
            if (in_array($k['code'], $codes, true)) {
                $linked[] = $k;
                $w = (float)($k['sub_kpi_weight'] ?: 1);
                $weighted += ((float)$k['current_achievement']) * $w;
                $weightSum += $w;
            }
        }
    }

    if ($weightSum > 0) {
        return ['pct' => round($weighted / $weightSum, 1), 'is_derived' => true, 'linked' => $linked];
    }

    $fallback = (float)rtrim((string)($project['progress_status'] ?? '0'), '%');
    return ['pct' => round($fallback, 1), 'is_derived' => false, 'linked' => $linked];
}

/** Status -> tailwind badge classes. */
function status_badge(string $status): string
{
    $s = strtolower(trim($status));
    if (str_contains($s, 'complet') || $s === 'approved' || $s === 'on track') return 'bg-emerald-100 text-emerald-800';
    if (str_contains($s, 'delay') || str_contains($s, 'stall') || $s === 'rejected') return 'bg-red-100 text-red-700';
    if (str_contains($s, 'pending') || str_contains($s, 'planning')) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
}

/** Severity -> icon colour. */
function severity_color(string $severity): string
{
    return match ($severity) {
        'approval' => 'text-amber-600 bg-amber-50',
        'warning'  => 'text-red-600 bg-red-50',
        'success'  => 'text-emerald-600 bg-emerald-50',
        default    => 'text-blue-600 bg-blue-50',
    };
}

/** Build a URL preserving the current page. */
function url(array $params = []): string
{
    $base = $_GET;
    foreach ($params as $k => $v) {
        if ($v === null) unset($base[$k]);
        else $base[$k] = $v;
    }
    return 'index.php?' . http_build_query($base);
}

/** Simple CSRF token helpers. */
function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . h(csrf_token()) . '">';
}

function verify_csrf(): void
{
    $token = $_POST['csrf'] ?? '';
    if (!hash_equals($_SESSION['csrf'] ?? '', (string)$token)) {
        http_response_code(419);
        exit('Invalid or expired form token. Please go back and try again.');
    }
}
