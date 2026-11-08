<?php
/** login.php — standalone login screen */
global $pdo;
$demoUsers = [];
if ($pdo) {
    try {
        $demoUsers = $pdo->query('SELECT full_name, email, role FROM users WHERE is_active = 1 ORDER BY id ASC LIMIT 6')->fetchAll();
    } catch (Throwable $e) { $demoUsers = []; }
}
$flashes = get_flashes();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in — <?= h(APP_NAME) ?></title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body class="min-h-screen flex items-center justify-center p-4" style="background:linear-gradient(135deg,#0a2356 0%,#0d3b82 55%,#0d47a1 100%);">
    <div class="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">
        <!-- brand panel -->
        <div class="p-8 text-white hidden md:flex flex-col justify-between" style="background:linear-gradient(160deg,#0a2356,#0d3b82);">
            <div>
                <div class="w-14 h-14 mb-4"><?php include __DIR__ . '/../includes/coat_of_arms.php'; ?></div>
                <div class="text-[10px] font-bold tracking-[0.2em] text-blue-200 uppercase">Republic of Kenya</div>
                <h1 class="text-xl font-extrabold leading-tight mt-1"><?= h(APP_ORG) ?></h1>
                <p class="text-[11px] text-blue-200 mt-2 leading-relaxed">Project Performance, Service Delivery &amp; Operational Management System</p>
            </div>
            <div class="text-[10px] text-blue-200/80 leading-relaxed mt-8">
                Native PHP / MySQL edition — ready for cPanel deployment.<br>
                Demo password for all seeded accounts: <span class="font-mono font-bold text-white"><?= h(APP_DEMO_PASSWORD) ?></span>
            </div>
        </div>

        <!-- form panel -->
        <div class="p-8">
            <h2 class="text-lg font-black text-slate-900">System sign in</h2>
            <p class="text-xs text-slate-500 mt-1 mb-5">Use your State Department account credentials.</p>

            <?php foreach ($flashes as $f): ?>
                <div class="flash <?= $f['type'] === 'error' ? 'flash-error' : 'flash-ok' ?> mb-4"><?= h($f['message']) ?></div>
            <?php endforeach; ?>

            <?php if (!empty($db_error)): ?>
                <div class="flash flash-error mb-4">Database not connected. Import <code>database/schema.sql</code> and update <code>config.php</code>.</div>
            <?php endif; ?>

            <form method="post" action="index.php?page=login" class="space-y-4">
                <?= csrf_field() ?>
                <div>
                    <label class="fld" for="email">Email address</label>
                    <input class="inp" type="email" id="email" name="email" required placeholder="name@health.go.ke">
                </div>
                <div>
                    <label class="fld" for="password">Password</label>
                    <input class="inp" type="password" id="password" name="password" required placeholder="••••••••">
                </div>
                <button class="btn btn-primary w-full justify-center" type="submit">Sign in</button>
            </form>

            <?php if ($demoUsers): ?>
                <div class="mt-6 border-t border-slate-100 pt-4">
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Quick demo accounts</div>
                    <div class="space-y-1">
                        <?php foreach ($demoUsers as $du): ?>
                            <button type="button"
                                    class="quick-login w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                    data-email="<?= h($du['email']) ?>" data-pass="<?= h(APP_DEMO_PASSWORD) ?>">
                                <span class="text-[11px] font-bold text-slate-800"><?= h($du['full_name']) ?></span>
                                <span class="text-[10px] text-slate-500"> — <?= h($du['role']) ?></span>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <script>
        document.querySelectorAll('.quick-login').forEach(function (b) {
            b.addEventListener('click', function () {
                document.getElementById('email').value = b.getAttribute('data-email');
                document.getElementById('password').value = b.getAttribute('data-pass');
                document.getElementById('email').focus();
            });
        });
    </script>
</body>
</html>
