// FJ Senior Level 1 — App Logic
// localStorage-based tracking, single-page app routing

(function() {
  'use strict';

  // ============ STORAGE KEYS ============
  const KEYS = {
    activated: 'fj_senior1_activated',
    completed: 'fj_senior1_completed',
    checkins: 'fj_senior1_checkins',
    reflections: 'fj_senior1_reflections',
    exercises: 'fj_senior1_exercises'
  };

  // ============ STATE ============
  let currentView = 'consent';
  let currentWeek = 1;
  let currentDay = null;

  // ============ STORAGE HELPERS (cached) ============
  // Cache parsed localStorage to avoid redundant JSON.parse calls
  const _cache = {};

  function getJSON(key, fallback) {
    if (_cache[key] !== undefined) return _cache[key];
    try {
      const v = localStorage.getItem(key);
      _cache[key] = v ? JSON.parse(v) : fallback;
      return _cache[key];
    } catch { return fallback; }
  }

  function setJSON(key, val) {
    _cache[key] = val;
    localStorage.setItem(key, JSON.stringify(val));
  }

  function isActivated() {
    return localStorage.getItem(KEYS.activated) === 'true';
  }

  function getCompleted() {
    return getJSON(KEYS.completed, {});
  }

  function isDayCompleted(day) {
    return !!getCompleted()[day];
  }

  function isDayUnlocked(day) {
    if (day === 1) return true;
    return isDayCompleted(day - 1);
  }

  function completeDay(day) {
    const c = getCompleted();
    c[day] = true;
    setJSON(KEYS.completed, c);
  }

  function getCompletedCount() {
    return Object.keys(getCompleted()).length;
  }

  function getCheckins() {
    return getJSON(KEYS.checkins, {});
  }

  function saveCheckin(day, data) {
    const c = getCheckins();
    c[day] = data;
    setJSON(KEYS.checkins, c);
  }

  function getReflections() {
    return getJSON(KEYS.reflections, {});
  }

  function saveReflection(day, text) {
    const r = getReflections();
    r[day] = text;
    setJSON(KEYS.reflections, r);
  }

  // ============ EXERCISE TRACKING ============
  function getExerciseDone() {
    return getJSON(KEYS.exercises, {});
  }

  function isExerciseDone(day, exIndex) {
    const e = getExerciseDone();
    return !!(e[day] && e[day][exIndex]);
  }

  function toggleExercise(day, exIndex) {
    const e = getExerciseDone();
    if (!e[day]) e[day] = {};
    e[day][exIndex] = !e[day][exIndex];
    setJSON(KEYS.exercises, e);
    return e[day][exIndex];
  }

  function getExerciseDoneCount(day, totalExercises) {
    const e = getExerciseDone();
    if (!e[day]) return 0;
    let count = 0;
    for (let i = 0; i < totalExercises; i++) {
      if (e[day][i]) count++;
    }
    return count;
  }

  function areAllExercisesDone(day, totalExercises) {
    return getExerciseDoneCount(day, totalExercises) === totalExercises;
  }

  // ============ VIEW ROUTING ============
  function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const view = document.getElementById('view-' + viewId);
    if (view) view.classList.add('active');

    const nav = document.getElementById('bottom-nav');
    const navViews = ['dashboard', 'progress', 'safety'];

    if (navViews.includes(viewId)) {
      nav.classList.remove('hidden');
      document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.view === viewId);
      });
    } else {
      nav.classList.add('hidden');
    }

    currentView = viewId;
    window.scrollTo(0, 0);
  }

  // ============ CONSENT SCREEN ============
  function renderConsent() {
    const flagsEl = document.getElementById('red-flags');
    flagsEl.innerHTML = SAFETY.redFlags.map(f => `<li>${f}</li>`).join('');

    const listEl = document.getElementById('consent-list');
    listEl.innerHTML = CONSENT_ITEMS.map((item, i) => `
      <label class="consent-item">
        <input type="checkbox" id="consent-${i}" onchange="window._checkConsent()">
        <span>${item}</span>
      </label>
    `).join('');

    document.getElementById('btn-activate').addEventListener('click', () => {
      localStorage.setItem(KEYS.activated, 'true');
      showView('dashboard');
      renderDashboard();
    });
  }

  window._checkConsent = function() {
    const boxes = document.querySelectorAll('#consent-list input[type="checkbox"]');
    const allChecked = Array.from(boxes).every(b => b.checked);
    document.getElementById('btn-activate').disabled = !allChecked;
  };

  // ============ DASHBOARD ============
  function renderDashboard() {
    renderWeekTabs();
    renderDayList();
    renderProgress();
  }

  function renderProgress() {
    const count = getCompletedCount();
    const pct = Math.round((count / 30) * 100);
    document.getElementById('progress-text').textContent = `${count}/30 วัน`;
    document.getElementById('progress-pct').textContent = `${pct}%`;
    document.getElementById('progress-fill').style.width = `${pct}%`;
  }

  function renderWeekTabs() {
    const el = document.getElementById('week-tabs');
    el.innerHTML = PROGRAM.weeks.map(w => `
      <button class="week-tab ${w.num === currentWeek ? 'active' : ''}" onclick="window._setWeek(${w.num})">
        <span class="week-num">สัปดาห์ ${w.num}</span>
        ${w.themeTH}
      </button>
    `).join('');
  }

  window._setWeek = function(w) {
    currentWeek = w;
    // Update active tab class without full re-render
    document.querySelectorAll('.week-tab').forEach(tab => {
      const weekNum = parseInt(tab.textContent.match(/\d+/));
      tab.classList.toggle('active', weekNum === w);
    });
    renderDayList();
  };

  function renderDayList() {
    const el = document.getElementById('day-list');
    const weekDays = DAYS.filter(d => d.week === currentWeek);

    el.innerHTML = weekDays.map(d => {
      const completed = isDayCompleted(d.day);
      const unlocked = isDayUnlocked(d.day);
      const totalEx = d.exercises ? d.exercises.length : 0;
      const doneEx = getExerciseDoneCount(d.day, totalEx);
      const categoryLabels = {
        strength: '🔴 Strength',
        balance: '🟡 Balance',
        mobility: '🟢 Mobility',
        checkin: '📋 Check-in'
      };

      let progressHint = '';
      if (unlocked && !completed && totalEx > 0 && doneEx > 0) {
        progressHint = `<div class="day-category" style="color:var(--fj-orange); font-weight:400;">${doneEx}/${totalEx} ท่าเสร็จ</div>`;
      }

      return `
        <div class="day-card ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}"
             onclick="${unlocked ? `window._openDay(${d.day})` : ''}">
          <div class="day-number" style="background:${completed ? '' : d.color}">
            <span>${d.day}</span>
          </div>
          <div class="day-info">
            <div class="day-title">${d.titleTH}</div>
            <div class="day-category">${categoryLabels[d.category] || d.category}</div>
            ${progressHint}
          </div>
          <div class="day-arrow"></div>
        </div>
      `;
    }).join('');
  }

  window._openDay = function(dayNum) {
    currentDay = DAYS.find(d => d.day === dayNum);
    if (!currentDay) return;
    showView('day');
    renderDayDetail();
  };

  // ============ DAY DETAIL ============
  function renderDayDetail() {
    const d = currentDay;
    if (!d) return;

    const completed = isDayCompleted(d.day);
    const checkins = getCheckins()[d.day] || {};
    const reflections = getReflections();
    const totalEx = d.exercises ? d.exercises.length : 0;
    const doneEx = getExerciseDoneCount(d.day, totalEx);

    let html = '';

    // Header
    html += `
      <div class="day-header" style="background:${d.color}">
        <div class="day-num">Day ${d.day} · สัปดาห์ที่ ${d.week}</div>
        <h2>${d.titleTH}</h2>
        <div class="day-sub">${d.subtitle}</div>
        ${d.rpeTarget ? `<span class="rpe-badge">RPE เป้าหมาย: ${d.rpeTarget}/10</span>` : ''}
      </div>
    `;

    // Retest banner for check-in days
    if (d.isCheckin) {
      const weekNum = d.week;
      html += `
        <div class="retest-banner">
          <h3>🏆 Retest สัปดาห์ที่ ${weekNum}${d.isFinal ? ' — วันสุดท้าย!' : ''}</h3>
          <p>วัดผลและบันทึกความก้าวหน้าของคุณ เปรียบเทียบกับสัปดาห์ก่อน</p>
        </div>
      `;
    }

    // Why important
    if (d.whyImportant) {
      html += `
        <div class="why-section">
          <h3>💡 ทำไมวันนี้ถึงสำคัญ</h3>
          <p>${d.whyImportant}</p>
        </div>
      `;
    }

    // Education video
    html += `
      <div class="video-section">
        <h3>🎬 ${d.educationTopic} (${d.educationDuration})</h3>
        <div class="video-embed">
          ${d.videoUrl ? `<iframe src="${getEmbedUrl(d.videoUrl)}" allowfullscreen></iframe>` : `
            <div class="video-placeholder">
              <div class="icon">🎥</div>
              <p>วิดีโอจะเพิ่มเร็วๆ นี้<br><small>${d.educationTopic}</small></p>
            </div>
          `}
        </div>
      </div>
    `;

    // Exercises with checkboxes and video buttons
    if (d.exercises && d.exercises.length > 0) {
      const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
      html += `
        <div class="exercise-section">
          <h3>💪 ท่าออกกำลังกายวันนี้</h3>
          <div class="exercise-progress">
            <span>${doneEx}/${totalEx} ท่า</span>
            <div class="exercise-progress-bar">
              <div class="exercise-progress-fill" style="width:${pct}%"></div>
            </div>
            <span>${pct}%</span>
          </div>
      `;
      d.exercises.forEach((ex, i) => {
        const done = isExerciseDone(d.day, i);
        const hasVideo = !!(ex.videoUrl);
        html += `
          <div class="exercise-card ${done ? 'exercise-done' : ''}" id="exercise-card-${i}">
            <div class="exercise-card-header">
              <div class="exercise-checkbox ${done ? 'checked' : ''}"
                   onclick="window._toggleExercise(${d.day}, ${i})"
                   id="exercise-check-${i}"></div>
              <div class="exercise-card-body">
                <div class="exercise-name">${ex.nameEN}</div>
                <div class="exercise-name-th">${ex.nameTH}</div>
                <div class="exercise-details">
                  <span class="exercise-tag">${ex.reps}</span>
                  <span class="exercise-tag">${ex.sets}</span>
                  ${ex.rest ? `<span class="exercise-tag">พัก ${ex.rest}</span>` : ''}
                </div>
                ${ex.benefit ? `<div class="exercise-benefit">${ex.benefit}</div>` : ''}
                <div class="exercise-actions">
                  <button class="btn-watch-video ${hasVideo ? '' : 'no-video'}"
                          onclick="${hasVideo ? `window._openVideo('${ex.nameEN}', '${ex.videoUrl}')` : ''}"
                          ${hasVideo ? '' : 'disabled'}>
                    ▶ ดูวิดีโอท่า${hasVideo ? '' : ' (เร็วๆ นี้)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    // Check-in / Retest fields
    if (d.isCheckin && d.checkinFields.length > 0) {
      html += `
        <div class="checkin-section">
          <h3>📋 บันทึกผล Retest${d.isFinal ? ' — วันสุดท้าย!' : ''}</h3>
      `;
      d.checkinFields.forEach(f => {
        const savedVal = checkins[f.key] || '';
        html += `
          <div class="checkin-field">
            <label>${f.label}</label>
            <div class="input-row">
              <input type="number" inputmode="numeric" id="checkin-${f.key}"
                     value="${savedVal}"
                     placeholder="กรอกตัวเลข"
                     onchange="window._saveCheckinField(${d.day}, '${f.key}', this.value)">
              <span class="unit">${f.unit}</span>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    // Reflection
    if (d.reflection) {
      const savedRef = reflections[d.day] || '';
      html += `
        <div class="reflection-section">
          <h3>💭 สะท้อนความรู้สึก</h3>
          <p style="font-size:0.88rem; margin-bottom:8px;">${d.reflection}</p>
          <textarea id="reflection-input"
                    placeholder="เขียนความรู้สึกของคุณ..."
                    onchange="window._saveReflection(${d.day}, this.value)">${savedRef}</textarea>
        </div>
      `;
    }

    // Final celebration
    if (d.isFinal && completed) {
      html += `
        <div class="celebration">
          <div class="emoji">🎉🏆</div>
          <h2>ยินดีด้วย!</h2>
          <p>คุณทำครบ 30 วันแล้ว! ตอนนี้คุณมีความแข็งแรง ทรงตัว และความมั่นใจมากขึ้น</p>
        </div>
      `;
    }

    // Complete button — requires all exercises ticked
    const allDone = totalEx === 0 || areAllExercisesDone(d.day, totalEx);
    const canComplete = allDone && !completed;
    html += `
      <button class="btn-complete ${completed ? 'completed' : ''} ${!allDone && !completed ? 'incomplete' : ''}"
              id="btn-complete-day"
              ${completed || !allDone ? 'disabled' : ''}
              onclick="window._completeDay(${d.day})">
        ${completed ? '✅ เสร็จแล้ว' : allDone ? 'เสร็จแล้ว ✅ — ไปวันถัดไป' : `ทำท่าให้ครบก่อน (${doneEx}/${totalEx})`}
      </button>
    `;

    document.getElementById('day-content').innerHTML = html;
  }

  function getEmbedUrl(url) {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?/]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  }

  // ============ EXERCISE ACTIONS ============
  window._toggleExercise = function(day, exIndex) {
    const nowDone = toggleExercise(day, exIndex);
    const d = currentDay;
    if (!d) return;

    // Targeted DOM updates instead of full re-render
    const card = document.getElementById('exercise-card-' + exIndex);
    const checkbox = document.getElementById('exercise-check-' + exIndex);
    if (card) {
      card.classList.toggle('exercise-done', nowDone);
    }
    if (checkbox) {
      checkbox.classList.toggle('checked', nowDone);
    }

    // Update progress bar
    const totalEx = d.exercises ? d.exercises.length : 0;
    const doneEx = getExerciseDoneCount(d.day, totalEx);
    const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
    const progEl = document.querySelector('.exercise-progress');
    if (progEl) {
      progEl.querySelector('span:first-child').textContent = `${doneEx}/${totalEx} ท่า`;
      progEl.querySelector('span:last-child').textContent = `${pct}%`;
      progEl.querySelector('.exercise-progress-fill').style.width = `${pct}%`;
    }

    // Update complete button
    const allDone = totalEx === 0 || areAllExercisesDone(d.day, totalEx);
    const completed = isDayCompleted(d.day);
    const btn = document.getElementById('btn-complete-day');
    if (btn && !completed) {
      btn.disabled = !allDone;
      btn.className = 'btn-complete' + (!allDone ? ' incomplete' : '');
      btn.textContent = allDone ? 'เสร็จแล้ว ✅ — ไปวันถัดไป' : `ทำท่าให้ครบก่อน (${doneEx}/${totalEx})`;
    }
  };

  window._openVideo = function(name, url) {
    const modal = document.getElementById('video-modal');
    document.getElementById('video-modal-title').textContent = name;
    const embedUrl = getEmbedUrl(url);
    document.getElementById('video-modal-content').innerHTML = `<iframe src="${embedUrl}?autoplay=1" allowfullscreen allow="autoplay"></iframe>`;
    modal.classList.remove('hidden');
  };

  window._closeVideo = function() {
    const modal = document.getElementById('video-modal');
    document.getElementById('video-modal-content').innerHTML = '';
    modal.classList.add('hidden');
  };

  // Video modal close handlers
  document.getElementById('video-modal-close').addEventListener('click', window._closeVideo);
  document.getElementById('video-modal').addEventListener('click', function(e) {
    if (e.target === this) window._closeVideo();
  });

  window._saveCheckinField = function(day, key, value) {
    const c = getCheckins()[day] || {};
    c[key] = value;
    saveCheckin(day, c);
  };

  window._saveReflection = function(day, text) {
    saveReflection(day, text);
  };

  window._completeDay = function(day) {
    completeDay(day);
    renderDayDetail();
    setTimeout(() => {
      showView('dashboard');
      renderDashboard();
    }, 800);
  };

  // ============ PROGRESS VIEW ============
  function renderProgressView() {
    const count = getCompletedCount();
    const pct = Math.round((count / 30) * 100);
    const checkins = getCheckins();
    const checkinDays = [7, 14, 21, 28, 30];

    let html = `
      <h2>📊 ความก้าวหน้าของคุณ</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-num">${count}</div>
          <div class="stat-label">วันที่ทำแล้ว</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${pct}%</div>
          <div class="stat-label">ความก้าวหน้า</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${30 - count}</div>
          <div class="stat-label">วันที่เหลือ</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${currentWeek}</div>
          <div class="stat-label">สัปดาห์ปัจจุบัน</div>
        </div>
      </div>
    `;

    // Retest comparison table
    const hasAnyCheckin = checkinDays.some(d => checkins[d]);
    if (hasAnyCheckin) {
      html += `
        <div class="checkin-history">
          <h3>🏆 ผล Retest รายสัปดาห์</h3>
          <table class="checkin-table">
            <thead>
              <tr>
                <th>รายการ</th>
                ${checkinDays.map(d => `<th>Day ${d}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chair Stand</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.chairStand || '—'}</td>`).join('')}
              </tr>
              <tr>
                <td>One-Leg (ขวา)</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.oneLegR || '—'}</td>`).join('')}
              </tr>
              <tr>
                <td>One-Leg (ซ้าย)</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.oneLegL || '—'}</td>`).join('')}
              </tr>
              <tr>
                <td>ความรู้สึก</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.feeling || '—'}</td>`).join('')}
              </tr>
              ${checkins[30]?.stepTest ? `
              <tr>
                <td>Step Test</td>
                ${checkinDays.map(d => `<td>${d === 30 ? (checkins[30]?.stepTest || '—') : '—'}</td>`).join('')}
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      `;
    } else {
      html += `<p style="color:var(--gray-500); text-align:center; margin-top:20px;">ยังไม่มีข้อมูล Retest — ทำ Day 7 เพื่อเริ่มบันทึกผล</p>`;
    }

    document.getElementById('progress-content').innerHTML = html;
  }

  // ============ SAFETY VIEW ============
  function renderSafetyView() {
    let html = `<h2>🛡️ ข้อมูลความปลอดภัย</h2>`;

    html += `
      <h3 style="margin-bottom:10px;">ระดับความเหนื่อย (RPE)</h3>
      <p style="font-size:0.85rem; color:var(--gray-500); margin-bottom:12px;">Level 1 ควรอยู่ที่ RPE 2–4 เท่านั้น</p>
      <table class="rpe-table">
        <thead>
          <tr><th>RPE</th><th>ระดับ</th><th>สัญญาณ</th></tr>
        </thead>
        <tbody>
    `;
    SAFETY.rpeScale.forEach(r => {
      const cls = r.stop ? 'rpe-stop' : r.warning ? 'rpe-warn' : 'rpe-ok';
      html += `<tr class="${cls}"><td>${r.rpe}</td><td>${r.level}</td><td>${r.signal}</td></tr>`;
    });
    html += `</tbody></table>`;

    html += `
      <div class="safety-callout" style="margin-top:20px;">
        <h4>🚨 หยุดทันทีถ้ามีอาการเหล่านี้</h4>
        <ul>${SAFETY.redFlags.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>
    `;

    html += `
      <h3 style="margin-top:20px; margin-bottom:10px;">💚 เช็คก่อนเริ่มทุกวัน</h3>
      <ul class="daily-check-list">
    `;
    SAFETY.dailyCheck.forEach(c => {
      html += `<li><span class="condition">${c.condition}</span><span class="action">→ ${c.action}</span></li>`;
    });
    html += `</ul>`;

    html += `
      <div style="background:var(--fj-cream); border-radius:var(--radius); padding:16px; margin-top:20px;">
        <h3 style="font-size:0.9rem; margin-bottom:10px;">💡 เคล็ดลับ</h3>
        <ul style="font-size:0.85rem; padding-left:18px; line-height:1.8;">
          <li>💧 จิบน้ำทุก 10–15 นาที แม้ไม่กระหาย</li>
          <li>🩺 ถ้ามีความดันสูง ห้ามก้มหัวต่ำกว่าเอว</li>
          <li>🌡️ ออกกำลังกายในห้องอุณหภูมิปกติ ไม่ร้อนจัด</li>
          <li>👟 พื้นราบ ไม่ลื่น + รองเท้าผ้าใบเสมอ</li>
        </ul>
      </div>
    `;

    document.getElementById('safety-content').innerHTML = html;
  }

  // ============ NAV HANDLERS ============
  document.getElementById('btn-back').addEventListener('click', () => {
    showView('dashboard');
    renderDashboard();
  });

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      showView(view);
      if (view === 'dashboard') renderDashboard();
      if (view === 'progress') renderProgressView();
      if (view === 'safety') renderSafetyView();
    });
  });

  // ============ INIT ============
  function init() {
    if (isActivated()) {
      showView('dashboard');
      renderDashboard();
    } else {
      showView('consent');
      renderConsent();
    }
  }

  init();
})();
