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
    document.getElementById('progress-text').textContent = `ทำไปแล้ว ${count} วัน`;
    document.getElementById('progress-fill').style.width = `${pct}%`;
  }

  function renderWeekTabs() {
    const el = document.getElementById('week-tabs');
    el.innerHTML = PROGRAM.weeks.map(w => `
      <button class="week-tab ${w.num === currentWeek ? 'active' : ''}"
              data-week="${w.num}"
              onclick="window._setWeek(${w.num})">
        สัปดาห์ ${w.num}
      </button>
    `).join('');
  }

  window._setWeek = function(w) {
    currentWeek = w;
    document.querySelectorAll('.week-tab').forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.week) === w);
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

      let statusText = '';
      if (completed) {
        statusText = '<div class="day-status completed">✅ เสร็จแล้ว</div>';
      } else if (unlocked && totalEx > 0 && doneEx > 0) {
        statusText = `<div class="day-status in-progress">ทำไปแล้ว ${doneEx}/${totalEx} ท่า</div>`;
      }

      return `
        <div class="day-card ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}"
             onclick="${unlocked ? `window._openDay(${d.day})` : ''}">
          <div class="day-number">
            <span>${d.day}</span>
          </div>
          <div class="day-info">
            <div class="day-label">วันที่ ${d.day}</div>
            <div class="day-title">${d.titleTH}</div>
            ${statusText}
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

    // Header — always FJ orange, no RPE, no English
    html += `
      <div class="day-header">
        <div class="day-num">วันที่ ${d.day}</div>
        <h2>${d.titleTH}</h2>
      </div>
    `;

    // Retest banner for check-in days — Thai only
    if (d.isCheckin) {
      html += `
        <div class="retest-banner">
          <h3>🏆 ${d.isFinal ? 'วันวัดผลสุดท้าย!' : 'วัดผลประจำสัปดาห์'}</h3>
          <p>บันทึกความก้าวหน้าของคุณ</p>
        </div>
      `;
    }

    // Collapsible: Why important + Education video
    if (d.whyImportant || d.educationTopic) {
      html += `
        <details class="learn-more">
          <summary>💡 อยากรู้เพิ่ม</summary>
          <div class="learn-content">
            ${d.whyImportant ? `<p>${d.whyImportant}</p>` : ''}
            <div class="video-section">
              <h4>🎬 ${d.educationTopic} (${d.educationDuration})</h4>
              <div class="video-embed">
                ${d.videoUrl ? `<iframe src="${getEmbedUrl(d.videoUrl)}" allowfullscreen></iframe>` : `
                  <div class="video-placeholder">
                    <div class="icon">🎥</div>
                    <p>วิดีโอจะเพิ่มเร็วๆ นี้</p>
                  </div>
                `}
              </div>
            </div>
          </div>
        </details>
      `;
    }

    // Exercises — simplified: Thai name, combined reps, no benefit text
    if (d.exercises && d.exercises.length > 0) {
      const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
      html += `
        <div class="exercise-section">
          <div class="exercise-progress">
            <div class="exercise-progress-bar">
              <div class="exercise-progress-fill" style="width:${pct}%"></div>
            </div>
            <span>${doneEx}/${totalEx} ท่า</span>
          </div>
      `;
      d.exercises.forEach((ex, i) => {
        const done = isExerciseDone(d.day, i);
        const hasVideo = !!(ex.videoUrl);
        const setsNum = parseInt(ex.sets) || 1;
        const repsLine = setsNum > 1 ? `${ex.reps} · ${ex.sets}` : ex.reps;
        html += `
          <div class="exercise-card ${done ? 'exercise-done' : ''}" id="exercise-card-${i}">
            <div class="exercise-card-header">
              <div class="exercise-checkbox ${done ? 'checked' : ''}"
                   onclick="window._toggleExercise(${d.day}, ${i})"
                   id="exercise-check-${i}"></div>
              <div class="exercise-card-body">
                <div class="exercise-name">${ex.nameTH}</div>
                <div class="exercise-details">
                  <span class="exercise-tag">${repsLine}</span>
                </div>
                <div class="exercise-actions">
                  <button class="btn-watch-video ${hasVideo ? '' : 'no-video'}"
                          onclick="${hasVideo ? `window._openVideo('${ex.nameTH}', '${ex.videoUrl}')` : ''}"
                          ${hasVideo ? '' : 'disabled'}>
                    ▶ ดูวิดีโอ${hasVideo ? '' : ' (เร็วๆ นี้)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    // Check-in fields — Thai labels
    if (d.isCheckin && d.checkinFields.length > 0) {
      html += `
        <div class="checkin-section">
          <h3>📋 บันทึกผล${d.isFinal ? ' — วันสุดท้าย!' : ''}</h3>
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
          <p>คุณทำครบ 30 วันแล้ว!</p>
        </div>
      `;
    }

    // Complete button
    const allDone = totalEx === 0 || areAllExercisesDone(d.day, totalEx);
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

    const card = document.getElementById('exercise-card-' + exIndex);
    const checkbox = document.getElementById('exercise-check-' + exIndex);
    if (card) card.classList.toggle('exercise-done', nowDone);
    if (checkbox) checkbox.classList.toggle('checked', nowDone);

    const totalEx = d.exercises ? d.exercises.length : 0;
    const doneEx = getExerciseDoneCount(d.day, totalEx);
    const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
    const progEl = document.querySelector('.exercise-progress');
    if (progEl) {
      progEl.querySelector('span').textContent = `${doneEx}/${totalEx} ท่า`;
      progEl.querySelector('.exercise-progress-fill').style.width = `${pct}%`;
    }

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
      <div class="progress-overview">
        <div class="progress-big-num">${count}<span>/30</span></div>
        <div class="progress-big-label">วันที่ทำแล้ว</div>
        <div class="progress-bar" style="margin-top:12px;">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-summary">${pct > 0 ? `เก่งมาก! ทำไปแล้ว ${pct}%` : 'เริ่มกันเลย!'}</div>
      </div>
    `;

    // Checkin comparison table — all Thai
    const hasAnyCheckin = checkinDays.some(d => checkins[d]);
    if (hasAnyCheckin) {
      html += `
        <div class="checkin-history">
          <h3>🏆 ผลวัดประจำสัปดาห์</h3>
          <table class="checkin-table">
            <thead>
              <tr>
                <th>รายการ</th>
                ${checkinDays.map(d => `<th>วันที่ ${d}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ลุก-นั่ง</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.chairStand || '—'}</td>`).join('')}
              </tr>
              <tr>
                <td>ยืนขาเดียว (ขวา)</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.oneLegR || '—'}</td>`).join('')}
              </tr>
              <tr>
                <td>ยืนขาเดียว (ซ้าย)</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.oneLegL || '—'}</td>`).join('')}
              </tr>
              <tr>
                <td>ความรู้สึก</td>
                ${checkinDays.map(d => `<td>${checkins[d]?.feeling || '—'}</td>`).join('')}
              </tr>
              ${checkins[30]?.stepTest ? `
              <tr>
                <td>เดิน 2 นาที</td>
                ${checkinDays.map(d => `<td>${d === 30 ? (checkins[30]?.stepTest || '—') : '—'}</td>`).join('')}
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      `;
    } else {
      html += `<p style="color:var(--gray-500); text-align:center; margin-top:20px;">ยังไม่มีข้อมูล — ทำวันที่ 7 เพื่อเริ่มบันทึกผล</p>`;
    }

    document.getElementById('progress-content').innerHTML = html;
  }

  // ============ SAFETY VIEW ============
  function renderSafetyView() {
    let html = `<h2>🛡️ ข้อมูลความปลอดภัย</h2>`;

    html += `
      <h3 style="margin-bottom:10px;">ระดับความเหนื่อย</h3>
      <p style="font-size:0.85rem; color:var(--gray-500); margin-bottom:12px;">โปรแกรมนี้ควรอยู่ที่ระดับ 2–4 เท่านั้น</p>
      <table class="rpe-table">
        <thead>
          <tr><th>ระดับ</th><th>ชื่อ</th><th>สัญญาณ</th></tr>
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
