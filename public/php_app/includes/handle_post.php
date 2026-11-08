<?php
/**
 * handle_post.php — central POST action processor
 * Included by index.php before any output.
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    return;
}

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/audit.php';

$action = $_POST['action'] ?? '';

try {
    switch ($action) {

        /* ---------------------------------------------------------
         * FINANCE RECORDS — edit / add financing figures
         * ------------------------------------------------------- */
        case 'finance_save':
            verify_csrf();
            if (!can('can_edit')) { set_flash('error', 'You do not have permission to edit finance records.'); break; }

            $pid        = (int)($_POST['project_id'] ?? 0);
            $allocated  = m_to_kes($_POST['budget_allocated_m'] ?? 0);
            $disbursed  = m_to_kes($_POST['funds_disbursed_m'] ?? 0);
            $utilised   = m_to_kes($_POST['funds_utilised_m'] ?? 0);
            $outstanding = max(0, $allocated - $utilised);

            $stmt = $pdo->prepare('SELECT project_code, sub_programme FROM projects WHERE id = ?');
            $stmt->execute([$pid]);
            $proj = $stmt->fetch();
            if (!$proj) { set_flash('error', 'Project not found.'); break; }

            $pdo->prepare('UPDATE projects SET total_budget = ?, funds_disbursed = ?, funds_utilized = ? WHERE id = ?')
                ->execute([$allocated, $disbursed, $utilised, $pid]);

            $detail = sprintf(
                'Updated financing for %s: Allocated %sM, Disbursed %sM, Utilised %sM, Outstanding %sM',
                $proj['sub_programme'], kes_m($allocated), kes_m($disbursed), kes_m($utilised), kes_m($outstanding)
            );
            $logId = log_audit('update', 'Finance Records', $detail, $pid);
            push_notification('Finance figures updated', $detail, 'Finance Records', 'info', $logId);
            set_flash('ok', 'Finance records saved for ' . $proj['sub_programme'] . '.');
            redirect('index.php?page=projects&tab=finance');
            break;

        /* ---------------------------------------------------------
         * PERFORMANCE CONTRACT — add record
         * ------------------------------------------------------- */
        case 'pc_add':
            verify_csrf();
            if (!can('can_edit')) { set_flash('error', 'You do not have permission to add performance records.'); break; }

            $code = trim($_POST['code'] ?? '');
            if ($code === '') { set_flash('error', 'KPI code is required.'); break; }

            $stmt = $pdo->prepare(
                'INSERT INTO performance_contracts
                 (code, category, category_weight, delivery_unit, programme, kpi_name,
                  target_baseline_2026_27, baseline_score, actual_2025_26, target_2025_26,
                  current_achievement, status, financial_year, mock_2026_27)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0)'
            );
            $stmt->execute([
                $code,
                trim($_POST['category'] ?? 'Core Mandate'),
                (float)($_POST['category_weight'] ?? 0),
                trim($_POST['delivery_unit'] ?? ''),
                trim($_POST['programme'] ?? ''),
                trim($_POST['kpi_name'] ?? ''),
                trim($_POST['target_baseline_2026_27'] ?? ''),
                trim($_POST['baseline_score'] ?? ''),
                trim($_POST['actual_2025_26'] ?? ''),
                trim($_POST['target_2025_26'] ?? ''),
                (int)($_POST['current_achievement'] ?? 0),
                trim($_POST['status'] ?? 'Approved'),
                trim($_POST['financial_year'] ?? '2026/2027'),
            ]);
            $newId = (int)$pdo->lastInsertId();
            $logId = log_audit('create', 'Performance Contract', 'Added performance contract record ' . $code . ' — ' . trim($_POST['kpi_name'] ?? ''), $newId);
            push_notification('Performance Contract record added', 'A new record (' . $code . ') was added to the performance contract matrix.', 'Performance Contract', 'success', $logId);
            set_flash('ok', 'Performance contract record ' . $code . ' added.');
            redirect('index.php?page=pc');
            break;

        /* ---------------------------------------------------------
         * ACTION POINTS — request a change (pending approval)
         * ------------------------------------------------------- */
        case 'action_request_change':
            verify_csrf();
            $actionId = (int)($_POST['action_id'] ?? 0);
            $field    = trim($_POST['field'] ?? '');
            $newValue = trim($_POST['new_value'] ?? '');
            $reason   = trim($_POST['reason'] ?? '');

            $allowedFields = ['status' => 'Status', 'action' => 'Action', 'person_responsible' => 'Person Responsible', 'timeline' => 'Timeline', 'resolution_notes' => 'Resolution Notes'];
            if (!isset($allowedFields[$field])) { set_flash('error', 'Invalid field selected.'); break; }
            if ($reason === '') { set_flash('error', 'A reason is required for every change request.'); break; }

            $stmt = $pdo->prepare('SELECT * FROM action_points WHERE id = ?');
            $stmt->execute([$actionId]);
            $ap = $stmt->fetch();
            if (!$ap) { set_flash('error', 'Action point not found.'); break; }

            $oldValue = (string)($ap[$field] ?? '');
            $u = current_user();

            $pdo->prepare(
                'INSERT INTO pending_changes (action_id, ref_no, field, old_value, new_value, reason, requested_by, requested_at, status)
                 VALUES (?,?,?,?,?,?,?,NOW(),"Pending")'
            )->execute([$actionId, $ap['ref_no'], $allowedFields[$field], $oldValue, $newValue, $reason, $u['full_name']]);

            $detail = sprintf('Change requested on %s: %s "%s" -> "%s". Reason: %s. Status: PENDING APPROVAL.',
                $ap['ref_no'], $allowedFields[$field], $oldValue, $newValue, $reason);
            $logId = log_audit('request_change', 'Action Points Tracker', $detail, $actionId);
            push_notification('Action change pending approval', $detail, 'Action Points Tracker', 'approval', $logId);
            set_flash('ok', 'Change request submitted and is pending approval.');
            redirect('index.php?page=actions&id=' . $actionId . '&tab=changes');
            break;

        /* ---------------------------------------------------------
         * PENDING CHANGES — approve / reject
         * ------------------------------------------------------- */
        case 'change_approve':
        case 'change_reject':
            verify_csrf();
            if (!is_approver()) { set_flash('error', 'Only admin / PS / approver accounts can action change requests.'); break; }

            $changeId = (int)($_POST['change_id'] ?? 0);
            $stmt = $pdo->prepare('SELECT * FROM pending_changes WHERE id = ?');
            $stmt->execute([$changeId]);
            $ch = $stmt->fetch();
            if (!$ch || $ch['status'] !== 'Pending') { set_flash('error', 'Change request is not pending.'); break; }

            $u = current_user();
            $fieldMap = ['Status' => 'status', 'Action' => 'action', 'Person Responsible' => 'person_responsible', 'Timeline' => 'timeline', 'Resolution Notes' => 'resolution_notes'];
            $col = $fieldMap[$ch['field']] ?? null;

            if ($action === 'change_approve') {
                if ($col) {
                    $pdo->prepare("UPDATE action_points SET `$col` = ? WHERE id = ?")->execute([$ch['new_value'], $ch['action_id']]);
                }
                $pdo->prepare('UPDATE pending_changes SET status = "Approved", approved_by = ?, approved_at = NOW() WHERE id = ?')
                    ->execute([$u['full_name'], $changeId]);
                $detail = sprintf('Approved change on %s: %s "%s" -> "%s". Approved by %s (%s).',
                    $ch['ref_no'], $ch['field'], $ch['old_value'], $ch['new_value'], $u['full_name'], $u['role']);
                $logId = log_audit('approve', 'Action Points Tracker', $detail, $ch['action_id']);
                push_notification('Action change approved', $detail, 'Action Points Tracker', 'success', $logId);
                set_flash('ok', 'Change approved and applied to ' . $ch['ref_no'] . '.');
            } else {
                $pdo->prepare('UPDATE pending_changes SET status = "Rejected", approved_by = ?, approved_at = NOW() WHERE id = ?')
                    ->execute([$u['full_name'], $changeId]);
                $detail = sprintf('Rejected change on %s: %s "%s" -> "%s". Rejected by %s (%s).',
                    $ch['ref_no'], $ch['field'], $ch['old_value'], $ch['new_value'], $u['full_name'], $u['role']);
                $logId = log_audit('reject', 'Action Points Tracker', $detail, $ch['action_id']);
                push_notification('Action change rejected', $detail, 'Action Points Tracker', 'warning', $logId);
                set_flash('ok', 'Change request rejected.');
            }
            redirect('index.php?page=actions&id=' . (int)$ch['action_id'] . '&tab=changes');
            break;

        /* ---------------------------------------------------------
         * NOTIFICATIONS — mark read
         * ------------------------------------------------------- */
        case 'notif_read':
            $id = (int)($_POST['id'] ?? 0);
            $pdo->prepare('UPDATE notifications SET is_read = 1 WHERE id = ?')->execute([$id]);
            $focus = $_POST['focus'] ?? '';
            redirect('index.php?page=audit-logs' . ($focus !== '' ? '&focus=' . (int)$focus : ''));
            break;

        case 'notif_read_all':
            $pdo->exec('UPDATE notifications SET is_read = 1');
            set_flash('ok', 'All notifications marked as read.');
            redirect('index.php?page=notifications');
            break;

        /* ---------------------------------------------------------
         * USERS — add (admin only)
         * ------------------------------------------------------- */
        case 'user_add':
            verify_csrf();
            if (!can('is_admin')) { set_flash('error', 'Only administrators can add users.'); break; }
            $email = trim($_POST['email'] ?? '');
            if ($email === '') { set_flash('error', 'Email is required.'); break; }
            try {
                $pdo->prepare(
                    'INSERT INTO users (full_name, email, role, directorate, is_active, can_upload, can_edit, can_approve, can_download, is_admin, last_login, password_hash)
                     VALUES (?,?,?,?,1,?,?,?,?,?,NULL,?)'
                )->execute([
                    trim($_POST['full_name'] ?? ''),
                    $email,
                    trim($_POST['role'] ?? ''),
                    trim($_POST['directorate'] ?? ''),
                    isset($_POST['can_upload']) ? 1 : 0,
                    isset($_POST['can_edit']) ? 1 : 0,
                    isset($_POST['can_approve']) ? 1 : 0,
                    isset($_POST['can_download']) ? 1 : 0,
                    isset($_POST['is_admin']) ? 1 : 0,
                    password_hash($_POST['password'] ?? APP_DEMO_PASSWORD, PASSWORD_BCRYPT),
                ]);
                $uid = (int)$pdo->lastInsertId();
                $logId = log_audit('create', 'Users', 'New user account created: ' . trim($_POST['full_name'] ?? '') . ' (' . trim($_POST['role'] ?? '') . ').', $uid);
                push_notification('New user account created', 'A new account was created for ' . trim($_POST['full_name'] ?? '') . '.', 'Users', 'success', $logId);
                set_flash('ok', 'User account created.');
            } catch (PDOException $e) {
                set_flash('error', 'Could not create user (email may already exist).');
            }
            redirect('index.php?page=users');
            break;
    }
} catch (Throwable $e) {
    set_flash('error', 'Action failed: ' . $e->getMessage());
}
