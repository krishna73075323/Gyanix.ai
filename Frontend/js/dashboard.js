/* ================================================================
   GYANIX AI — DASHBOARD JAVASCRIPT
   Charts (Pie/Bar/Line), Case Table, Filters, Modal, Pagination
   ================================================================ */

(function () {
  'use strict';

  // ─── MOCK DATA ────────────────────────────────────────────────────
  const MOCK_CASES = [
    { id: 'GX-2024-7901', type: 'Ragging',        severity: 'Critical', sentiment: '😨 Fear',    desc: 'Senior students forcefully making juniors do embarrassing tasks in hostel at 2am every night.', date: '2024-12-10', status: 'Pending',   lang: 'Hindi',   urgent: true,  summary: 'Repeated ragging incidents in hostel by senior students causing severe psychological trauma to first-year students.' },
    { id: 'GX-2024-7898', type: 'Harassment',     severity: 'High',     sentiment: '😡 Angry',   desc: 'Professor making inappropriate comments about female students in class regularly.',              date: '2024-12-09', status: 'In Review', lang: 'English', urgent: false, summary: 'Faculty member making sexually inappropriate remarks in class, affecting students comfort and performance.' },
    { id: 'GX-2024-7895', type: 'Corruption',     severity: 'High',     sentiment: '😤 Angry',   desc: 'HOD demanding money for signing NOC forms. Rs 500 per signature.',                              date: '2024-12-09', status: 'Pending',   lang: 'Hindi',   urgent: false, summary: 'Department head demanding bribe for official documentation, a clear case of institutional corruption.' },
    { id: 'GX-2024-7890', type: 'Ragging',        severity: 'Critical', sentiment: '😨 Fear',    desc: 'Physical assault by third year students near parking area. Happened twice this week.',           date: '2024-12-08', status: 'Pending',   lang: 'Urdu',    urgent: true,  summary: 'Repeated physical ragging incidents near campus parking. Immediate security intervention required.' },
    { id: 'GX-2024-7885', type: 'Discrimination', severity: 'High',     sentiment: '😞 Sad',     desc: 'Faculty giving lower marks to students from specific states. North Indian students are targeted.',date: '2024-12-08', status: 'In Review', lang: 'English', urgent: false, summary: 'Systematic regional discrimination in grading by faculty affecting students from Northern states.' },
    { id: 'GX-2024-7881', type: 'Academic',       severity: 'Medium',   sentiment: '😤 Worried', desc: 'Exam papers leaked before exam. Several students had access to questions beforehand.',           date: '2024-12-07', status: 'Pending',   lang: 'Hindi',   urgent: false, summary: 'Alleged examination paper leak affecting academic integrity. Multiple students reportedly had advance access.' },
    { id: 'GX-2024-7876', type: 'Harassment',     severity: 'Critical', sentiment: '😨 Fear',    desc: 'Online threats from batch group. Being sent threatening messages daily on WhatsApp.',            date: '2024-12-07', status: 'Pending',   lang: 'English', urgent: true,  summary: 'Cyberbullying and online threats via social media causing significant psychological distress.' },
    { id: 'GX-2024-7870', type: 'Corruption',     severity: 'Medium',   sentiment: '😡 Angry',   desc: 'Attendance manipulation by class representative at teacher request. Bunks are being approved.',  date: '2024-12-06', status: 'Resolved',  lang: 'English', urgent: false, summary: 'Collusion between faculty and class representative for attendance fraud benefiting select students.' },
    { id: 'GX-2024-7865', type: 'Ragging',        severity: 'High',     sentiment: '😨 Fear',    desc: 'Being forced to clean seniors rooms and run errands at odd hours in boys hostel.',               date: '2024-12-06', status: 'Resolved',  lang: 'Hindi',   urgent: false, summary: 'Domestic servitude-type ragging where seniors force juniors to perform personal chores.' },
    { id: 'GX-2024-7859', type: 'Discrimination', severity: 'Medium',   sentiment: '😞 Sad',     desc: 'Muslim students not given access to prayer room that was promised in college prospectus.',       date: '2024-12-05', status: 'Pending',   lang: 'Urdu',    urgent: false, summary: 'Religious discrimination — denial of promised prayer facilities to Muslim students.' },
    { id: 'GX-2024-7853', type: 'Academic',       severity: 'Low',      sentiment: '😐 Normal',  desc: 'Internal marks submitted without showing students their answer sheets as per UGC guidelines.',   date: '2024-12-05', status: 'Resolved',  lang: 'English', urgent: false, summary: 'Violation of UGC transparency norms regarding internal assessment answer sheet disclosure.' },
    { id: 'GX-2024-7847', type: 'Harassment',     severity: 'High',     sentiment: '😡 Angry',   desc: 'Lab assistant using offensive language and insulting students who ask basic questions.',          date: '2024-12-04', status: 'Resolved',  lang: 'Hindi',   urgent: false, summary: 'Non-teaching staff engaging in verbal abuse and harassment of students in laboratory settings.' },
    { id: 'GX-2024-7841', type: 'Corruption',     severity: 'High',     sentiment: '😡 Angry',   desc: 'Canteen contractor selling expired food. Complained multiple times, no action taken.',           date: '2024-12-04', status: 'In Review', lang: 'English', urgent: false, summary: 'Food safety violation — expired products being sold in campus canteen despite repeated complaints.' },
    { id: 'GX-2024-7835', type: 'Ragging',        severity: 'Medium',   sentiment: '😐 Normal',  desc: 'Asked to perform at seniors cultural night without consent. Felt humiliated in front of crowd.',  date: '2024-12-03', status: 'Resolved',  lang: 'English', urgent: false, summary: 'Forced participation in ragging disguised as cultural activity causing public humiliation.' },
    { id: 'GX-2024-7829', type: 'Academic',       severity: 'Medium',   sentiment: '😤 Worried', desc: 'Professor not covering syllabus and still setting questions from uncovered topics in exams.',    date: '2024-12-03', status: 'Pending',   lang: 'Hindi',   urgent: false, summary: 'Academic negligence — faculty not completing syllabus but testing students on untaught content.' },
  ];

  // ─── STATE ────────────────────────────────────────────────────────
  let cases       = [...MOCK_CASES];
  let filtered    = [...cases];
  let currentPage = 1;
  const PER_PAGE  = 8;
  let charts      = {};
  let activeCaseId = null;

  // ─── CHART.JS DEFAULTS ───────────────────────────────────────────
  Chart.defaults.color          = '#6060a0';
  Chart.defaults.borderColor    = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family    = 'Inter, sans-serif';

  const CHART_COLORS = {
    violet:  '#7c3aed',
    cyan:    '#06b6d4',
    emerald: '#10b981',
    amber:   '#f59e0b',
    rose:    '#f43f5e',
    pink:    '#ec4899',
  };

  // ─── PIE CHART ───────────────────────────────────────────────────
  function buildPieChart() {
    const counts = {};
    cases.forEach(c => { counts[c.type] = (counts[c.type] || 0) + 1; });

    const labels = Object.keys(counts);
    const data   = Object.values(counts);
    const colors = [
      CHART_COLORS.rose, CHART_COLORS.amber, CHART_COLORS.violet,
      CHART_COLORS.cyan, CHART_COLORS.pink, CHART_COLORS.emerald
    ];

    const legendEl = document.getElementById('pie-legend');
    legendEl.innerHTML = labels.map((l, i) =>
      `<div class="legend-item">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span>${l} (${counts[l]})</span>
      </div>`
    ).join('');

    const ctx = document.getElementById('pieChart').getContext('2d');
    charts.pie = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.map(c => c + 'cc'),
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,13,26,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} reports`,
            }
          }
        },
        animation: { animateRotate: true, duration: 1000 }
      }
    });
  }

  // ─── BAR CHART ───────────────────────────────────────────────────
  function buildBarChart() {
    const weeks   = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'];
    const ragging = [8, 12, 7, 15, 10, 13, 9];
    const harass  = [5, 8, 11, 6, 9, 7, 12];
    const corrupt = [3, 5, 4, 7, 3, 6, 4];

    const ctx = document.getElementById('barChart').getContext('2d');
    charts.bar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [
          {
            label: 'Ragging',
            data: ragging,
            backgroundColor: CHART_COLORS.rose + '99',
            borderColor: CHART_COLORS.rose,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          {
            label: 'Harassment',
            data: harass,
            backgroundColor: CHART_COLORS.amber + '99',
            borderColor: CHART_COLORS.amber,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          {
            label: 'Corruption',
            data: corrupt,
            backgroundColor: CHART_COLORS.violet + '99',
            borderColor: CHART_COLORS.violet,
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 14, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(13,13,26,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 }, stepSize: 5 }, beginAtZero: true }
        },
        animation: { duration: 1000 }
      }
    });
  }

  // ─── LINE CHART ──────────────────────────────────────────────────
  function generateLineData(days) {
    const labels = [];
    const total  = [];
    const crit   = [];
    const resolved = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
      total.push(Math.floor(4 + Math.random() * 12));
      crit.push(Math.floor(Math.random() * 4));
      resolved.push(Math.floor(2 + Math.random() * 8));
    }
    return { labels, total, crit, resolved };
  }

  function buildLineChart(days = 30) {
    const { labels, total, crit, resolved } = generateLineData(days);
    const ctx = document.getElementById('lineChart').getContext('2d');

    const makeGradient = (color) => {
      const grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '00');
      return grad;
    };

    if (charts.line) charts.line.destroy();

    charts.line = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Reports',
            data: total,
            borderColor: CHART_COLORS.violet,
            backgroundColor: makeGradient(CHART_COLORS.violet),
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: CHART_COLORS.violet,
          },
          {
            label: 'Critical',
            data: crit,
            borderColor: CHART_COLORS.rose,
            backgroundColor: makeGradient(CHART_COLORS.rose),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: CHART_COLORS.rose,
            borderDash: [4, 3],
          },
          {
            label: 'Resolved',
            data: resolved,
            borderColor: CHART_COLORS.emerald,
            backgroundColor: makeGradient(CHART_COLORS.emerald),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: CHART_COLORS.emerald,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 12, padding: 16, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(13,13,26,0.97)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { font: { size: 10 }, maxTicksLimit: days > 14 ? 10 : days }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { font: { size: 11 }, stepSize: 5 },
            beginAtZero: true,
          }
        },
        animation: { duration: 800 }
      }
    });
  }

  // ─── SEVERITY BADGES ──────────────────────────────────────────────
  function getSevBadge(sev) {
    const map = {
      Critical: `<span class="sev-badge sev-critical">🔴 Critical</span>`,
      High:     `<span class="sev-badge sev-high">🟠 High</span>`,
      Medium:   `<span class="sev-badge sev-medium">🟡 Medium</span>`,
      Low:      `<span class="sev-badge sev-low">🟢 Low</span>`,
    };
    return map[sev] || sev;
  }

  function getStatusBadge(st) {
    const map = {
      Pending:   `<span class="status-badge status-pending">⏳ Pending</span>`,
      'In Review': `<span class="status-badge status-review">🔍 In Review</span>`,
      Resolved:  `<span class="status-badge status-resolved">✅ Resolved</span>`,
    };
    return map[st] || st;
  }

  // ─── RENDER TABLE ────────────────────────────────────────────────
  function renderTable() {
    const start = (currentPage - 1) * PER_PAGE;
    const slice = filtered.slice(start, start + PER_PAGE);
    const tbody = document.getElementById('cases-tbody');
    const empty = document.getElementById('table-empty');

    if (slice.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'flex';
      return;
    }

    empty.style.display = 'none';
    tbody.innerHTML = slice.map(c => `
      <tr data-id="${c.id}" onclick="openModal('${c.id}')">
        <td class="td-id">${c.id}</td>
        <td>${c.type}</td>
        <td>${getSevBadge(c.severity)}</td>
        <td class="sent-badge">${c.sentiment}</td>
        <td class="td-desc" title="${c.desc}">${c.desc}</td>
        <td style="white-space:nowrap;font-size:0.8rem">${formatDate(c.date)}</td>
        <td>${getStatusBadge(c.status)}</td>
        <td><button class="view-btn" onclick="event.stopPropagation();openModal('${c.id}')">View →</button></td>
      </tr>
    `).join('');

    renderPagination();
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ─── PAGINATION ──────────────────────────────────────────────────
  function renderPagination() {
    const total    = Math.ceil(filtered.length / PER_PAGE);
    const prevBtn  = document.getElementById('prev-page');
    const nextBtn  = document.getElementById('next-page');
    const numsEl   = document.getElementById('page-numbers');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === total;

    numsEl.innerHTML = Array.from({ length: total }, (_, i) =>
      `<button class="page-num ${i + 1 === currentPage ? 'active' : ''}" onclick="goPage(${i + 1})">${i + 1}</button>`
    ).join('');
  }

  window.goPage = function (n) {
    currentPage = n;
    renderTable();
    document.querySelector('.cases-table-wrap').scrollIntoView({ behavior: 'smooth' });
  };

  // ─── FILTERS ────────────────────────────────────────────────────
  function applyFilters() {
    const status   = document.getElementById('filter-status').value;
    const severity = document.getElementById('filter-severity').value;
    const category = document.getElementById('filter-category').value;
    const search   = document.getElementById('search-input').value.toLowerCase();

    filtered = cases.filter(c => {
      const matchStatus   = status   === 'all' || c.status === status;
      const matchSeverity = severity === 'all' || c.severity === severity;
      const matchCategory = category === 'all' || c.type === category;
      const matchSearch   = !search  ||
        c.id.toLowerCase().includes(search) ||
        c.type.toLowerCase().includes(search) ||
        c.desc.toLowerCase().includes(search);
      return matchStatus && matchSeverity && matchCategory && matchSearch;
    });

    filtered.sort((a, b) => {
      const sevOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      if (sevOrder[a.severity] !== sevOrder[b.severity])
        return sevOrder[a.severity] - sevOrder[b.severity];
      return new Date(b.date) - new Date(a.date);
    });

    currentPage = 1;
    renderTable();
  }

  // ─── MODAL ──────────────────────────────────────────────────────
  window.openModal = function (id) {
    const c = cases.find(x => x.id === id);
    if (!c) return;
    activeCaseId = id;

    document.getElementById('modal-tracking').textContent = c.id;
    document.getElementById('modal-title').textContent    = `${c.type} Report`;
    document.getElementById('modal-date').textContent     = formatDate(c.date);
    document.getElementById('modal-status').innerHTML     = getStatusBadge(c.status);
    document.getElementById('modal-lang').textContent     = c.lang;
    document.getElementById('modal-urgent').textContent   = c.urgent ? '⚡ Yes — Emergency' : 'No';
    document.getElementById('modal-summary').textContent  = c.summary;
    document.getElementById('modal-desc').textContent     = c.desc;

    document.getElementById('modal-severity-badge').innerHTML  = getSevBadge(c.severity);
    document.getElementById('modal-sentiment-badge').innerHTML = `<span class="sev-badge sev-medium">${c.sentiment}</span>`;
    document.getElementById('modal-category-badge').innerHTML  = `<span class="sev-badge sev-low">${c.type}</span>`;

    const resolveBtn = document.getElementById('modal-resolve-btn');
    resolveBtn.disabled = c.status === 'Resolved';
    resolveBtn.style.opacity = c.status === 'Resolved' ? '0.5' : '1';

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
    activeCaseId = null;
  }

  function updateCaseStatus(newStatus) {
    if (!activeCaseId) return;
    const c = cases.find(x => x.id === activeCaseId);
    if (c) {
      if (c._id && !c._id.startsWith('local_')) {
        const sessionRaw = sessionStorage.getItem('gyanix_admin') || localStorage.getItem('gyanix_admin_remember');
        let token = null;
        if (sessionRaw) {
          try { token = JSON.parse(sessionRaw).token; } catch(e) {}
        }

        fetch((window.API_BASE || '') + `/api/reports/${c._id}/status`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update status on server');
          return res.json();
        })
        .then(() => {
          c.status = newStatus;
          applyFilters();
          updateStatCounts();
          showToast(`Case ${activeCaseId} marked as "${newStatus}"`);
        })
        .catch(err => {
          console.error(err);
          showToast(`Error: ${err.message}`);
        });
      } else {
        c.status = newStatus;
        applyFilters();
        updateStatCounts();
        showToast(`Case ${activeCaseId} marked as "${newStatus}" (Mock Mode)`);
      }
    }
    closeModal();
  }

  // ─── STATS COUNTER ANIMATION ────────────────────────────────────
  function animateCount(el, target) {
    const start = performance.now();
    const dur   = 1200;
    const update = (now) => {
      const p   = Math.min((now - start) / dur, 1);
      const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  function updateStatCounts() {
    const pending  = cases.filter(c => c.status === 'Pending').length;
    const resolved = cases.filter(c => c.status === 'Resolved').length;
    const critical = cases.filter(c => c.severity === 'Critical' && c.status !== 'Resolved').length;

    document.querySelector('#ds-total .ds-number').textContent   = cases.length + 232;
    document.querySelector('#ds-pending .ds-number').textContent = pending + 50;
    document.querySelector('#ds-resolved .ds-number').textContent= resolved + 177;
    document.querySelector('#ds-critical .ds-number').textContent= critical;

    document.getElementById('pending-count-badge').textContent = pending;
    document.getElementById('notif-badge').textContent = critical;
  }

  // ─── TOAST NOTIFICATION ─────────────────────────────────────────
  function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);
      background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);
      color:#34d399;padding:12px 24px;border-radius:999px;font-size:0.85rem;font-weight:600;
      z-index:9999;opacity:0;transition:all 0.3s;backdrop-filter:blur(12px);
      font-family:'Inter',sans-serif;
    `;
    t.textContent = '✓ ' + msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; }, 50);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
  }

  // ─── TOPBAR DATE ────────────────────────────────────────────────
  function setDate() {
    const now = new Date();
    document.getElementById('topbar-date').textContent =
      now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // ─── SIDEBAR TOGGLE ─────────────────────────────────────────────
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main    = document.getElementById('dashboard-main');
    const isMobile = () => window.innerWidth <= 900;

    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      if (isMobile()) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
        main.classList.toggle('expanded');
      }
    });

    document.addEventListener('click', (e) => {
      if (isMobile() && !sidebar.contains(e.target) &&
          !document.getElementById('sidebar-toggle').contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // ─── INIT ────────────────────────────────────────────────────────
  function init() {
    setDate();
    initSidebar();

    // load admin name from session
    var sessionRaw = sessionStorage.getItem('gyanix_admin') || localStorage.getItem('gyanix_admin_remember');
    if (sessionRaw) {
      try {
        var adminData = JSON.parse(sessionRaw);
        var nameEl   = document.getElementById('sidebar-admin-name');
        var roleEl   = document.getElementById('sidebar-admin-role');
        var avatarEl = document.getElementById('admin-avatar-letter');
        if (nameEl)   nameEl.textContent   = adminData.name   || 'Admin';
        if (roleEl)   roleEl.textContent   = adminData.role   || 'Admin';
        if (avatarEl) avatarEl.textContent = (adminData.name || 'A')[0].toUpperCase();
      } catch(e) { /* invalid session, ignore */ }
    }

    // logout button
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
          sessionStorage.removeItem('gyanix_admin');
          localStorage.removeItem('gyanix_admin_remember');
          window.location.href = 'login.html';
        }
      });
    }

    // Animate stat numbers
    document.querySelectorAll('.ds-number[data-count]').forEach(el => {
      animateCount(el, parseInt(el.dataset.count));
    });

    // Build charts
    buildPieChart();
    buildBarChart();
    buildLineChart(30);

    applyFilters();
    updateStatCounts();

    ['filter-status', 'filter-severity', 'filter-category'].forEach(id => {
      document.getElementById(id).addEventListener('change', applyFilters);
    });

    document.getElementById('search-input').addEventListener('input', () => {
      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(applyFilters, 300);
    });

    document.getElementById('filter-reset').addEventListener('click', () => {
      document.getElementById('filter-status').value   = 'all';
      document.getElementById('filter-severity').value = 'all';
      document.getElementById('filter-category').value = 'all';
      document.getElementById('search-input').value    = '';
      applyFilters();
    });

    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; renderTable(); }
    });
    document.getElementById('next-page').addEventListener('click', () => {
      const total = Math.ceil(filtered.length / PER_PAGE);
      if (currentPage < total) { currentPage++; renderTable(); }
    });

    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        buildLineChart(parseInt(tab.dataset.period));
      });
    });

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-close-btn2').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) closeModal();
    });
    document.getElementById('modal-resolve-btn').addEventListener('click', () => updateCaseStatus('Resolved'));
    document.getElementById('modal-review-btn').addEventListener('click',  () => updateCaseStatus('In Review'));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          const id = this.id;
          document.getElementById('page-title').textContent =
            id === 'nav-overview' ? 'Overview' :
            id === 'nav-cases'    ? 'All Cases' :
            id === 'nav-critical' ? 'Critical Cases' :
            id === 'nav-analytics'? 'Analytics' : 'Dashboard';

          if (id === 'nav-critical') {
            document.getElementById('filter-severity').value = 'Critical';
            applyFilters();
          } else if (id === 'nav-cases' || id === 'nav-overview') {
            document.getElementById('filter-severity').value = 'all';
            applyFilters();
          }
        }
      });
    });

    fetchReports();
  }

  function fetchReports() {
    const sessionRaw = sessionStorage.getItem('gyanix_admin') || localStorage.getItem('gyanix_admin_remember');
    let token = null;
    if (sessionRaw) {
      try { token = JSON.parse(sessionRaw).token; } catch(e) {}
    }

    if (!token) {
      console.warn("No auth token found. Running in offline mock mode.");
      return;
    }

    fetch((window.API_BASE || '') + '/api/reports', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('API request failed');
      return res.json();
    })
    .then(resData => {
      if (resData.success && Array.isArray(resData.data)) {
        const mappedCases = resData.data.map(r => ({
          _id: r._id,
          id: r.trackingId,
          type: r.category || 'Other',
          severity: r.aiSeverity || 'Medium',
          sentiment: r.sentimentLabel || 'Fear',
          desc: r.description,
          date: r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          status: r.status || 'Pending',
          lang: r.selectedLang || 'English',
          urgent: r.isUrgent || r.aiSeverity === 'Critical',
          summary: r.aiSummary || 'Summary compiled by AI.'
        }));

        const merged = [...mappedCases];
        MOCK_CASES.forEach(mc => {
          if (!merged.some(c => c.id === mc.id)) {
            merged.push(mc);
          }
        });

        cases = merged;
        applyFilters();
        updateStatCounts();

        if (charts.pie) charts.pie.destroy();
        if (charts.bar) charts.bar.destroy();
        buildPieChart();
        buildBarChart();
      }
    })
    .catch(err => {
      console.warn("Could not fetch reports from backend (server offline or token expired). Using mock data:", err);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();