<?php
/**
 * index.php — PP-SDOMS front controller (native PHP / MySQL)
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/audit.php';

$page = $_GET['page'] ?? 'dashboard';

/* ---- logout ---- */
if ($page === 'logout') {
    logout_user();
    redirect('index.php?page=login');
}

/* ---- login (POST) ---- */
if ($page === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    [$ok, $msg] = attempt_login($_POST['email'] ?? '', $_POST['password'] ?? '');
    if ($ok) {
        set_flash('ok', $msg);
        redirect('index.php?page=dashboard');
    }
    set_flash('error', $msg);
    redirect('index.php?page=login');
}

/* ---- all other POST actions ---- */
require_once __DIR__ . '/includes/handle_post.php';

/* ---- route table ---- */
$routes = [
    'dashboard'    => 'dashboard.php',
    'flagships'    => 'flagships.php',
    'projects'     => 'projects.php',
    'pc'           => 'pc.php',
    'diary'        => 'diary.php',
    'project-view' => 'project-view.php',
    'actions'      => 'actions.php',
    'notifications'=> 'notifications.php',
    'audit-logs'   => 'audit-logs.php',
    'users'        => 'users.php',
    'login'        => 'login.php',
];

if (!isset($routes[$page])) {
    $page = 'dashboard';
}

/* ---- login page is standalone ---- */
if ($page === 'login') {
    if (is_logged_in()) redirect('index.php?page=dashboard');
    include __DIR__ . '/modules/login.php';
    exit;
}

/* ---- everything else requires a session ---- */
require_login();

include __DIR__ . '/includes/header.php';
include __DIR__ . '/modules/' . $routes[$page];
include __DIR__ . '/includes/footer.php';
