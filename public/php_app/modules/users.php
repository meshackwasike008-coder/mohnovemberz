<?php
/**
 * users.php — user accounts & access control (admin only).
 */
global $pdo;

$me = current_user();
$isAdmin = !empty($me['is_admin']);

$users = [];
if ($pdo) {
    try {
        $users = $pdo->query('SELECT * FROM users ORDER BY is_admin DESC, full_name ASC')->fetchAll();
    } catch (Throwable $e) {
        $users = [];
    }
}

$activeCount = 0;
$adminCount = 0;
$approverCount = 0;
foreach ($users as $u) {
    if (!empty($u['is_active'])) $activeCount++;
    if (!empty($u['is_admin'])) $adminCount++;
    if (!empty($u['can_approve'])) $approverCount++;
}

/** Small yes/no capability pill. */
function cap_pill($on): string
{
    return $on
        ? '<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-700">YES</span>'
        : '<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-100 text-slate-400">NO</span>';
}
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Users &amp; Access Control</h2>
        <p class="text-xs text-slate-500 mt-0.5">Accounts, roles and capability permissions for the SDOMS platform.</p>
    </div>
    <?php if ($isAdmin): ?>
        <button type="button" class="btn btn-primary" data-open-modal="userAddModal">+ Add User</button>
    <?php endif; ?>
</div>

<?php if (!$isAdmin): ?>
<div class="card card-pad text-center text-slate-500 text-sm">
    You do not have permission to manage user accounts. Please contact an administrator.
</div>
<?php return; ?>
<?php endif; ?>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div class="card card-pad">
        <div class="text-[10px] uppercase font-bold text-slate-400">Total accounts</div>
        <div class="text-2xl font-black text-slate-900 mt-1"><?= count($users) ?></div>
    </div>
    <div class="card card-pad">
        <div class="text-[10px] uppercase font-bold text-slate-400">Active</div>
        <div class="text-2xl font-black text-emerald-600 mt-1"><?= $activeCount ?></div>
    </div>
    <div class="card card-pad">
        <div class="text-[10px] uppercase font-bold text-slate-400">Administrators</div>
        <div class="text-2xl font-black text-blue-700 mt-1"><?= $adminCount ?></div>
    </div>
    <div class="card card-pad">
        <div class="text-[10px] uppercase font-bold text-slate-400">Approvers</div>
        <div class="text-2xl font-black text-amber-600 mt-1"><?= $approverCount ?></div>
    </div>
</div>

<div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 class="section-title">Accounts</h3>
        <span class="text-[10px] font-bold text-slate-400">Capabilities</span>
    </div>
    <div class="overflow-x-auto">
        <table class="data">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Directorate</th>
                    <th>Active</th>
                    <th>Upload</th>
                    <th>Edit</th>
                    <th>Approve</th>
                    <th>Download</th>
                    <th>Admin</th>
                    <th>Last login</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!$users): ?>
                    <tr><td colspan="11" class="text-center text-slate-400 py-8">No user accounts found.</td></tr>
                <?php else: ?>
                    <?php foreach ($users as $u): ?>
                        <tr>
                            <td>
                                <div class="flex items-center gap-2">
                                    <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-black">
                                        <?= h(strtoupper(substr($u['full_name'], 0, 1))) ?>
                                    </span>
                                    <span class="text-[11px] font-bold text-slate-800"><?= h($u['full_name']) ?></span>
                                </div>
                            </td>
                            <td class="text-[11px] text-slate-600"><?= h($u['email']) ?></td>
                            <td class="text-[11px] text-slate-700"><?= h($u['role']) ?></td>
                            <td class="text-[11px] text-slate-500"><?= h($u['directorate']) ?></td>
                            <td><?= cap_pill(!empty($u['is_active'])) ?></td>
                            <td><?= cap_pill(!empty($u['can_upload'])) ?></td>
                            <td><?= cap_pill(!empty($u['can_edit'])) ?></td>
                            <td><?= cap_pill(!empty($u['can_approve'])) ?></td>
                            <td><?= cap_pill(!empty($u['can_download'])) ?></td>
                            <td><?= cap_pill(!empty($u['is_admin'])) ?></td>
                            <td class="text-[10px] text-slate-400 whitespace-nowrap">
                                <?= $u['last_login'] ? h(pretty_datetime($u['last_login'])) : 'Never' ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Add User modal -->
<div class="modal-backdrop hidden" id="userAddModal">
    <div class="modal-panel">
        <div class="modal-head">
            <h3>Add User Account</h3>
            <button type="button" class="modal-x" data-close-modal="userAddModal">&times;</button>
        </div>
        <form method="post" action="index.php">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="user_add">
            <div class="modal-body">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="fld">
                        <label>Full name <span class="text-red-500">*</span></label>
                        <input class="inp" type="text" name="full_name" required>
                    </div>
                    <div class="fld">
                        <label>Email <span class="text-red-500">*</span></label>
                        <input class="inp" type="email" name="email" required>
                    </div>
                    <div class="fld">
                        <label>Role</label>
                        <input class="inp" type="text" name="role" placeholder="e.g. M&amp;E Officer">
                    </div>
                    <div class="fld">
                        <label>Directorate</label>
                        <input class="inp" type="text" name="directorate" placeholder="e.g. Health Informatics Directorate">
                    </div>
                    <div class="fld sm:col-span-2">
                        <label>Initial password</label>
                        <input class="inp" type="text" name="password" value="<?= h(APP_DEMO_PASSWORD) ?>">
                        <p class="text-[10px] text-slate-400 mt-1">Leave as default; the user can change it after first login.</p>
                    </div>
                </div>
                <div class="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-700">
                    <label class="flex items-center gap-1.5"><input type="checkbox" name="can_upload" checked> Upload</label>
                    <label class="flex items-center gap-1.5"><input type="checkbox" name="can_edit" checked> Edit</label>
                    <label class="flex items-center gap-1.5"><input type="checkbox" name="can_approve"> Approve</label>
                    <label class="flex items-center gap-1.5"><input type="checkbox" name="can_download" checked> Download</label>
                    <label class="flex items-center gap-1.5"><input type="checkbox" name="is_admin"> Admin</label>
                </div>
            </div>
            <div class="modal-foot">
                <button type="button" class="btn btn-ghost" data-close-modal="userAddModal">Cancel</button>
                <button type="submit" class="btn btn-primary">Create account</button>
            </div>
        </form>
    </div>
</div>
