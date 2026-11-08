/* PP-SDOMS native PHP — small UI helpers */
(function () {
    'use strict';

    // Notification dropdown toggle
    var btn = document.getElementById('notifBtn');
    var menu = document.getElementById('notifMenu');
    if (btn && menu) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });
        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.add('hidden');
            }
        });
    }

    // Generic modal open/close via data attributes
    document.querySelectorAll('[data-open-modal]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var id = el.getAttribute('data-open-modal');
            var m = document.getElementById(id);
            if (m) m.classList.remove('hidden');
        });
    });
    document.querySelectorAll('[data-close-modal]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var m = el.closest('.modal-backdrop');
            if (m) m.classList.add('hidden');
        });
    });
    document.querySelectorAll('.modal-backdrop').forEach(function (m) {
        m.addEventListener('click', function (e) {
            if (e.target === m) m.classList.add('hidden');
        });
    });

    // Escape closes modals
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop').forEach(function (m) { m.classList.add('hidden'); });
            if (menu) menu.classList.add('hidden');
        }
    });

    // Auto-open a modal when ?open= is present
    var params = new URLSearchParams(window.location.search);
    var openId = params.get('open');
    if (openId) {
        var om = document.getElementById(openId);
        if (om) om.classList.remove('hidden');
    }

    // Auto-open a diary detail modal when ?event=ID is present
    var ev = params.get('event');
    if (ev) {
        var em = document.getElementById('diaryModal-' + ev);
        if (em) em.classList.remove('hidden');
    }
})();
