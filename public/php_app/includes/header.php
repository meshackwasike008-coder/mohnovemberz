<?php
/**
 * header.php — sticky application header + navigation
 * Expects: $page (current page slug), $current_user
 */
$current_user = current_user();
$page = $page ?? 'dashboard';
$unread = unread_notification_count();
$notifs = latest_notifications(8);
$navItems = [
    'dashboard'   => 'Dashboard',
    'flagships'   => 'Priority Flagships',
    'projects'    => 'Projects & Programmes',
    'pc'          => 'Performance Contracts',
    'diary'       => 'Official Diary',
    'actions'     => 'Action Points',
];
if (can_view_notifications()) {
    $navItems['notifications'] = 'Notifications';
}
$navItems['audit-logs'] = 'Audit Logs';
if (can('is_admin')) {
    $navItems['users'] = 'Users';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= h(APP_NAME) ?> — <?= h(APP_ORG) ?></title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body class="antialiased min-h-screen flex flex-col bg-[#f4f7fb] text-slate-800">

<!-- ================= STICKY HEADER (whole row) ================= -->
<header class="app-sticky">
    <div class="app-header-bar">
        <div class="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">

            <!-- Coat of arms + organisation title -->
            <div class="flex items-center gap-3 min-w-0">
                <div class="coat-wrap shrink-0">
                    <?php include __DIR__ . '/coat_of_arms.php'; ?>
                </div>
                <div class="min-w-0 leading-tight">
                    <div class="text-[9px] sm:text-[10px] font-bold tracking-[0.18em] text-blue-200 uppercase">
                        Republic of Kenya
                    </div>
                    <h1 class="text-[13px] sm:text-[17px] font-extrabold tracking-tight text-white truncate">
                        <?= h(APP_ORG) ?>
                    </h1>
                    <div class="text-[9px] sm:text-[10px] text-blue-200 font-semibold truncate">
                        Project Performance, Service Delivery &amp; Operational Management System
                    </div>
                </div>
            </div>

            <!-- Last login + user + notifications -->
            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                <div class="hidden md:block text-right leading-tight">
                    <div class="text-[9px] uppercase tracking-wider text-blue-200 font-bold">Last login</div>
                    <div class="text-[11px] font-semibold text-white"><?= h(pretty_datetime($current_user['last_login'] ?? null)) ?></div>
                </div>

                <div class="hidden sm:block h-8 w-px bg-white/20"></div>

                <div class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full pl-1 pr-3 py-1">
                    <span class="w-7 h-7 rounded-full bg-white text-[#0d47a1] font-black text-[11px] flex items-center justify-center">
                        <?= h(strtoupper(substr($current_user['full_name'] ?? 'U', 0, 1))) ?>
                    </span>
                    <div class="leading-tight">
                        <div class="text-[11px] font-bold text-white max-w-[140px] truncate"><?= h($current_user['full_name'] ?? 'Guest') ?></div>
                        <div class="text-[9px] text-blue-200 max-w-[140px] truncate"><?= h($current_user['role'] ?? '') ?></div>
                    </div>
                </div>

                <!-- Notification bell -->
                <div class="relative" id="notifWrap">
                    <button type="button" id="notifBtn" class="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white" aria-label="Notifications">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"/>
                        </svg>
                        <?php if ($unread > 0): ?>
                            <span class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center"><?= $unread > 99 ? '99+' : $unread ?></span>
                        <?php endif; ?>
                    </button>

                    <div id="notifMenu" class="notif-menu hidden">
                        <div class="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                            <span class="text-[11px] font-black uppercase tracking-wider text-slate-500">Notifications</span>
                            <a href="index.php?page=notifications" class="text-[10px] font-bold text-blue-700 hover:underline">View all</a>
                        </div>
                        <div class="max-h-80 overflow-y-auto">
                            <?php if (!$notifs): ?>
                                <div class="px-3 py-6 text-center text-[11px] text-slate-400">No notifications yet.</div>
                            <?php endif; ?>
                            <?php foreach ($notifs as $n): ?>
                                <a href="index.php?page=audit-logs&focus=<?= (int)$n['id'] ?>"
                                   class="notif-item <?= $n['is_read'] ? 'is-read' : 'is-unread' ?>">
                                    <div class="flex items-start gap-2">
                                        <span class="mt-1 w-1.5 h-1.5 rounded-full <?= $n['is_read'] ? 'bg-slate-300' : 'bg-blue-600' ?> shrink-0"></span>
                                        <div class="min-w-0">
                                            <div class="text-[11px] font-bold text-slate-800 leading-snug"><?= h($n['title']) ?></div>
                                            <div class="text-[10px] text-slate-500 leading-snug line-clamp-2"><?= h($n['message']) ?></div>
                                            <div class="text-[9px] text-slate-400 mt-0.5"><?= h(pretty_datetime($n['created_at'])) ?> · <?= h($n['module']) ?></div>
                                        </div>
                                    </div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <a href="index.php?page=logout" class="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/80 border border-white/20 flex items-center justify-center text-white" title="Sign out">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                </a>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="app-nav">
            <div class="max-w-[1400px] mx-auto px-2 flex gap-0.5 overflow-x-auto">
                <?php foreach ($navItems as $slug => $label): ?>
                    <a href="index.php?page=<?= h($slug) ?>"
                       class="nav-link <?= $page === $slug ? 'active' : '' ?>">
                        <?= h($label) ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </nav>
    </div>
</header>

<main class="max-w-[1400px] mx-auto px-4 py-6 flex-1 w-full space-y-6">
    <?php if (!empty($db_error)): ?>
        <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs text-amber-800 font-medium">
            <b>Database not connected.</b> <?= h($db_error) ?> — import <code>database/schema.sql</code> via phpMyAdmin and update <code>config.php</code>.
        </div>
    <?php endif; ?>
    <?php foreach (get_flashes() as $f): ?>
        <div class="flash <?= $f['type'] === 'error' ? 'flash-error' : 'flash-ok' ?>"><?= h($f['message']) ?></div>
    <?php endforeach; ?>
