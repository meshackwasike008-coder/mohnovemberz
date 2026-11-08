<?php
/** diary.php — official diary: events & meetings with compact detail popups */
global $pdo;

$events = [];
$meetings = [];
$projects = [];
if ($pdo) {
    $events   = $pdo->query('SELECT * FROM events ORDER BY event_date ASC, id ASC')->fetchAll();
    $meetings = $pdo->query('SELECT * FROM meetings ORDER BY date DESC, id DESC')->fetchAll();
    $projects = $pdo->query('SELECT id, sub_programme, project_code, delivery_unit FROM projects ORDER BY id ASC')->fetchAll();
}

/** Heuristic: projects related to a diary item by keyword overlap. */
function related_projects(array $item, array $projects): array
{
    $text = strtolower(($item['title'] ?? '') . ' ' . ($item['description'] ?? '') . ' ' . ($item['agenda'] ?? ''));
    $stop = ['the','and','for','with','of','to','in','on','a','an','meeting','review','quarterly','national','health','project','deliverables'];
    $words = array_filter(preg_split('/[^a-z0-9]+/', $text), fn($w) => strlen($w) > 3 && !in_array($w, $stop));
    $out = [];
    foreach ($projects as $p) {
        $hay = strtolower($p['sub_programme'] . ' ' . $p['delivery_unit'] . ' ' . $p['project_code']);
        foreach ($words as $w) {
            if (str_contains($hay, $w)) { $out[] = $p; break; }
        }
        if (count($out) >= 4) break;
    }
    if (!$out) $out = array_slice($projects, 0, 3);
    return $out;
}
?>
<div class="flex flex-wrap items-center justify-between gap-3">
    <div>
        <h2 class="text-lg font-black text-slate-900">Official Ministerial Diary</h2>
        <p class="text-xs text-slate-500 mt-0.5">Executive meetings, commissioning ceremonies and stakeholder briefs. Click any item for details.</p>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- Events -->
    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 class="section-title">Events &amp; Milestones</h3>
            <span class="text-[11px] text-slate-500"><?= count($events) ?></span>
        </div>
        <div class="divide-y divide-slate-100">
            <?php foreach ($events as $e): ?>
                <button type="button" class="w-full text-left px-4 py-3 hover:bg-slate-50" data-open-modal="diaryModal-e<?= (int)$e['id'] ?>">
                    <div class="flex items-center justify-between gap-2">
                        <span class="badge bg-purple-600 text-white"><?= h($e['event_type']) ?></span>
                        <span class="text-[10px] font-semibold text-slate-500"><?= h(pretty_date($e['event_date'])) ?> · <?= h($e['event_time']) ?></span>
                    </div>
                    <div class="text-[12px] font-bold text-slate-900 mt-1"><?= h($e['title']) ?></div>
                    <div class="text-[10px] text-slate-500"><?= h($e['location']) ?></div>
                </button>
            <?php endforeach; ?>
            <?php if (!$events): ?><div class="px-4 py-6 text-center text-slate-400 text-xs">No events.</div><?php endif; ?>
        </div>
    </div>

    <!-- Meetings -->
    <div class="card">
        <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 class="section-title">Meetings</h3>
            <span class="text-[11px] text-slate-500"><?= count($meetings) ?></span>
        </div>
        <div class="divide-y divide-slate-100">
            <?php foreach ($meetings as $m): ?>
                <button type="button" class="w-full text-left px-4 py-3 hover:bg-slate-50" data-open-modal="diaryModal-m<?= (int)$m['id'] ?>">
                    <div class="flex items-center justify-between gap-2">
                        <span class="badge bg-blue-600 text-white">Meeting</span>
                        <span class="text-[10px] font-semibold text-slate-500"><?= h(pretty_date($m['date'])) ?></span>
                    </div>
                    <div class="text-[12px] font-bold text-slate-900 mt-1"><?= h($m['title']) ?></div>
                    <div class="text-[10px] text-slate-500"><?= h($m['venue']) ?></div>
                </button>
            <?php endforeach; ?>
            <?php if (!$meetings): ?><div class="px-4 py-6 text-center text-slate-400 text-xs">No meetings.</div><?php endif; ?>
        </div>
    </div>
</div>

<!-- ============ Compact detail popups ============ -->
<?php foreach ($events as $e): $rel = related_projects($e, $projects); ?>
    <div class="modal-backdrop hidden" id="diaryModal-e<?= (int)$e['id'] ?>">
        <div class="modal-panel modal-sm">
            <div class="modal-head">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="badge bg-purple-600 text-white"><?= h($e['event_type']) ?></span>
                        <span class="badge <?= h(status_badge($e['status'])) ?>"><?= h($e['status']) ?></span>
                    </div>
                    <h3 class="text-[13px] font-black text-slate-900 mt-1 leading-snug"><?= h($e['title']) ?></h3>
                </div>
                <button type="button" class="text-slate-400 hover:text-slate-700 text-lg leading-none" data-close-modal>&times;</button>
            </div>
            <div class="modal-body !py-3 space-y-2 text-[11px]">
                <p class="text-slate-600 leading-relaxed"><?= h($e['description']) ?></p>
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Date &amp; time</div><div class="font-semibold text-slate-800"><?= h(pretty_date($e['event_date'])) ?> · <?= h($e['event_time']) ?></div></div>
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Location</div><div class="font-semibold text-slate-800"><?= h($e['location']) ?></div></div>
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Host</div><div class="font-semibold text-slate-800"><?= h($e['host']) ?></div></div>
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Attendees</div><div class="font-semibold text-slate-800"><?= h($e['attendees']) ?></div></div>
                </div>
                <div class="pt-2 border-t border-slate-100">
                    <div class="text-[9px] uppercase font-bold text-slate-400 mb-1">Linked projects</div>
                    <ul class="space-y-0.5">
                        <?php foreach ($rel as $p): ?>
                            <li><a class="proj-link text-[11px]" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>
<?php endforeach; ?>

<?php foreach ($meetings as $m): $rel = related_projects($m, $projects); ?>
    <div class="modal-backdrop hidden" id="diaryModal-m<?= (int)$m['id'] ?>">
        <div class="modal-panel modal-sm">
            <div class="modal-head">
                <div>
                    <span class="badge bg-blue-600 text-white">Meeting</span>
                    <h3 class="text-[13px] font-black text-slate-900 mt-1 leading-snug"><?= h($m['title']) ?></h3>
                </div>
                <button type="button" class="text-slate-400 hover:text-slate-700 text-lg leading-none" data-close-modal>&times;</button>
            </div>
            <div class="modal-body !py-3 space-y-2 text-[11px]">
                <p class="text-slate-600 leading-relaxed"><?= h($m['description']) ?></p>
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Date</div><div class="font-semibold text-slate-800"><?= h(pretty_date($m['date'])) ?></div></div>
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Venue</div><div class="font-semibold text-slate-800"><?= h($m['venue']) ?></div></div>
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Financier</div><div class="font-semibold text-slate-800"><?= h($m['financier']) ?></div></div>
                    <div><div class="text-[9px] uppercase font-bold text-slate-400">Document</div><div class="font-semibold text-slate-800"><?= h($m['document']) ?></div></div>
                </div>
                <div class="pt-1">
                    <div class="text-[9px] uppercase font-bold text-slate-400">Agenda</div>
                    <div class="text-slate-700"><?= h($m['agenda']) ?></div>
                    <div class="text-[9px] uppercase font-bold text-slate-400 mt-1">Decisions</div>
                    <div class="text-slate-700"><?= h($m['decisions']) ?></div>
                </div>
                <div class="pt-2 border-t border-slate-100">
                    <div class="text-[9px] uppercase font-bold text-slate-400 mb-1">Linked projects</div>
                    <ul class="space-y-0.5">
                        <?php foreach ($rel as $p): ?>
                            <li><a class="proj-link text-[11px]" data-hint="Click to view details" href="index.php?page=project-view&id=<?= (int)$p['id'] ?>"><?= h($p['sub_programme']) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>
<?php endforeach; ?>
