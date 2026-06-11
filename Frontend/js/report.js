/* ============================================================
   GYANIX AI — REPORT PAGE JAVASCRIPT
   Multi-step form, Language selector, AI chatbot, Submission
   ============================================================ */

(function () {
  'use strict';

  // ─── STATE ────────────────────────────────────────────────────────
  const state = {
    currentStep: 1,
    selectedType: null,
    selectedLang: 'en',
    description: '',
    location: '',
    date: '',
    isUrgent: false,
    trackingId: '',
  };

  // ─── TRANSLATIONS ─────────────────────────────────────────────────
  const T = {
    en: {
      step2Title: 'Describe what happened',
      step2Sub: 'Be as detailed as possible — names, dates, location. Only admin will see this.',
      step3Title: 'Review your report',
      step3Sub: 'Check details before submitting. You will get a tracking ID after submission.',
      labelLocation: '📍 Location (optional)',
      labelDescription: '📝 Describe the incident',
      labelWhen: '🗓️ When did it happen? (optional)',
      labelUrgent: '⚡ Is this an emergency?',
      labelUrgentDesc: 'Yes, I need immediate help',
      placeholderDesc: 'Write here... What happened, when, who was involved...',
      issueRagging: 'Ragging',
      issueRaggingDesc: 'Physical or mental harassment by seniors',
      issueHarassment: 'Harassment',
      issueHarassmentDesc: 'Sexual, verbal or physical harassment',
      issueCorruption: 'Corruption',
      issueCorruptionDesc: 'Bribery, marks manipulation or fee fraud',
      issueAcademic: 'Academic Misconduct',
      issueAcademicDesc: 'Unfair exams, biased grading, plagiarism',
      issueDiscrimination: 'Discrimination',
      issueDiscriminationDesc: 'Caste, religion, gender or regional bias',
      issueOther: 'Other Issue',
      issueOtherDesc: 'Any other campus safety concern',
    },
    hi: {
      step2Title: 'क्या हुआ बताओ',
      step2Sub: 'जितना हो सके विस्तार से लिखो — नाम, तारीख, जगह। सिर्फ एडमिन देखेगा।',
      step3Title: 'रिपोर्ट जांचें',
      step3Sub: 'सबमिट करने से पहले एक बार देख लो। सबमिट के बाद ट्रैकिंग ID मिलेगी।',
      labelLocation: '📍 जगह (वैकल्पिक)',
      labelDescription: '📝 घटना का विवरण',
      labelWhen: '🗓️ कब हुआ? (वैकल्पिक)',
      labelUrgent: '⚡ क्या यह आपातकाल है?',
      labelUrgentDesc: 'हाँ, मुझे तुरंत मदद चाहिए',
      placeholderDesc: 'यहाँ लिखो... क्या हुआ, कब हुआ, कौन था...',
      issueRagging: 'रैगिंग',
      issueRaggingDesc: 'सीनियर्स द्वारा शारीरिक या मानसिक उत्पीड़न',
      issueHarassment: 'उत्पीड़न',
      issueHarassmentDesc: 'यौन, मौखिक या शारीरिक उत्पीड़न',
      issueCorruption: 'भ्रष्टाचार',
      issueCorruptionDesc: 'रिश्वत, नंबर में हेरफेर या फीस धोखाधड़ी',
      issueAcademic: 'शैक्षणिक गड़बड़ी',
      issueAcademicDesc: 'अनुचित परीक्षा, पक्षपाती ग्रेडिंग',
      issueDiscrimination: 'भेदभाव',
      issueDiscriminationDesc: 'जाति, धर्म, लिंग या क्षेत्रीय पूर्वाग्रह',
      issueOther: 'अन्य समस्या',
      issueOtherDesc: 'कोई और कैंपस सुरक्षा चिंता',
    },
    ur: {
      step2Title: 'کیا ہوا بتائیں',
      step2Sub: 'جتنا ہو سکے تفصیل سے لکھیں — نام، تاریخ، مقام۔ صرف ایڈمن دیکھے گا۔',
      step3Title: 'رپورٹ چیک کریں',
      step3Sub: 'جمع کرنے سے پہلے ایک بار دیکھ لیں۔ ٹریکنگ ID ملے گی۔',
      labelLocation: '📍 مقام (اختیاری)',
      labelDescription: '📝 واقعہ کی تفصیل',
      labelWhen: '🗓️ کب ہوا؟ (اختیاری)',
      labelUrgent: '⚡ کیا یہ ہنگامی صورتحال ہے؟',
      labelUrgentDesc: 'ہاں، مجھے فوری مدد چاہیے',
      placeholderDesc: 'یہاں لکھیں... کیا ہوا، کب ہوا، کون تھا...',
      issueRagging: 'ریگنگ',
      issueRaggingDesc: 'سینئرز کی طرف سے جسمانی یا ذہنی ہراسانی',
      issueHarassment: 'ہراسانی',
      issueHarassmentDesc: 'جنسی، زبانی یا جسمانی ہراسانی',
      issueCorruption: 'بدعنوانی',
      issueCorruptionDesc: 'رشوت، نمبروں میں ہیرا پھیری',
      issueAcademic: 'تعلیمی بدعنوانی',
      issueAcademicDesc: 'ناانصاف امتحانات، جانبدارانہ گریڈنگ',
      issueDiscrimination: 'امتیاز',
      issueDiscriminationDesc: 'ذات، مذہب، صنف یا علاقائی تعصب',
      issueOther: 'دوسرا مسئلہ',
      issueOtherDesc: 'کوئی اور کیمپس سیفٹی کا مسئلہ',
    }
  };

  // ─── AI CHATBOT KNOWLEDGE BASE ────────────────────────────────────
  const chatKB = {
    'how': 'To file a report:\n1️⃣ Select issue type\n2️⃣ Describe what happened\n3️⃣ Review & submit\nYou\'ll get an anonymous tracking ID instantly!',
    'anonymous': '🔒 YES! Your report is 100% anonymous.\n\n• No name stored\n• No IP address logged\n• No login required\n• Only admins see the content\n\nAap bilkul safe ho!',
    'ragging': 'Ragging report karne ke liye:\n• Issue Type mein "Ragging" select karo\n• Details mein batao: kab, kahan, kisne kiya\n• Emergency toggle ON karo agar abhi danger mein ho\n\nYeh Critical Priority case hoga! 🔴',
    'after': 'Submit karne ke baad:\n✅ Aapko tracking ID milega\n✅ AI immediately analyze karega\n✅ Admin ko notify kiya jayega\n✅ Case priority ke according handle hoga\n\nTracking ID se status check kar sakte ho!',
    'harassment': 'Harassment report karne ke liye:\n• "Harassment" select karo\n• Jitna detail de sako dena — time, place, person\n• Emergency hai to toggle ON karo\n\nHigh Priority case treat kiya jayega! 🟠',
    'safe': '🛡️ Bilkul safe ho! Gyanix AI mein:\n• Aapka naam kahin nahi hoga\n• Server pe sirf complaint content store hota hai\n• Azure ke encrypted servers pe data hai',
    'default': 'Main samjha nahi! 😊 Yeh try karo:\n• "How to file?" — report process ke baare mein\n• "Am I anonymous?" — privacy ke baare mein\n• "After submit?" — kya hoga submit ke baad\n\nYa seedha apna sawal likho Hindi/English mein!'
  };

  function getChatResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('how') || lower.includes('kaise') || lower.includes('file') || lower.includes('report karna')) return chatKB.how;
    if (lower.includes('anon') || lower.includes('safe') || lower.includes('identity') || lower.includes('pehchaan') || lower.includes('naam')) return chatKB.anonymous;
    if (lower.includes('ragging') || lower.includes('senior') || lower.includes('bully')) return chatKB.ragging;
    if (lower.includes('after') || lower.includes('baad') || lower.includes('submit') || lower.includes('happen')) return chatKB.after;
    if (lower.includes('harass') || lower.includes('sexual') || lower.includes('abuse')) return chatKB.harassment;
    if (lower.includes('safe') || lower.includes('secure') || lower.includes('data') || lower.includes('privacy')) return chatKB.safe;
    return chatKB.default;
  }

  // ─── MOCK AI ANALYSIS ─────────────────────────────────────────────
  function getMockAIResult(type, desc) {
    const results = {
      ragging:        { category: 'Ragging',            severity: '🔴 Critical', sentiment: '😨 Fear',   color: '#f43f5e' },
      harassment:     { category: 'Harassment',         severity: '🟠 High',     sentiment: '😡 Angry',  color: '#f59e0b' },
      corruption:     { category: 'Corruption',         severity: '🟡 Medium',   sentiment: '😤 Angry',  color: '#8b5cf6' },
      academic:       { category: 'Academic Misconduct',severity: '🟡 Medium',   sentiment: '😤 Worried',color: '#06b6d4' },
      discrimination: { category: 'Discrimination',     severity: '🟠 High',     sentiment: '😞 Fear',   color: '#10b981' },
      other:          { category: 'Other',              severity: '🟢 Low',      sentiment: '😐 Normal', color: '#a78bfa' },
    };

    const r = results[type] || results.other;
    const summaries = [
      `Student has reported an incident of ${r.category.toLowerCase()} on campus. The complaint indicates ${r.sentiment.split(' ')[1].toLowerCase()} sentiment and requires ${r.severity.split(' ')[1].toLowerCase()} priority attention from the administration.`,
      `A complaint regarding ${r.category.toLowerCase()} has been filed anonymously. Based on the description provided, immediate review is recommended by the admin team.`,
      `Anonymous report filed regarding ${r.category.toLowerCase()}. AI analysis suggests this is a genuine complaint requiring ${r.severity.split(' ')[1].toLowerCase()} priority response.`,
    ];

    return {
      ...r,
      summary: summaries[Math.floor(Math.random() * summaries.length)],
    };
  }

  // ─── GENERATE TRACKING ID ────────────────────────────────────────
  function generateTrackingId() {
    const year = new Date().getFullYear();
    const num  = Math.floor(1000 + Math.random() * 9000);
    return `GX-${year}-${num}`;
  }

  // ─── STEP MANAGEMENT ────────────────────────────────────────────
  function goToStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');

    // Update step indicator
    for (let i = 1; i <= 3; i++) {
      const si = document.getElementById(`si-${i}`);
      if (!si) continue;
      si.classList.remove('active', 'done');
      if (i < n) si.classList.add('done');
      else if (i === n) si.classList.add('active');
    }

    // Update connectors
    document.querySelectorAll('.step-line').forEach((line, idx) => {
      line.classList.toggle('done', idx + 1 < n);
    });

    // Scroll to top of form
    document.getElementById('form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.currentStep = n;
  }

  // ─── LANGUAGE SELECTOR ─────────────────────────────────────────
  function applyLanguage(lang) {
    state.selectedLang = lang;
    const t = T[lang];

    // Update labels
    document.getElementById('step2-title').textContent       = t.step2Title;
    document.getElementById('step2-sub').textContent         = t.step2Sub;
    document.getElementById('step3-title').textContent       = t.step3Title;
    document.getElementById('step3-sub').textContent         = t.step3Sub;
    document.getElementById('label-location').textContent    = t.labelLocation;
    document.getElementById('label-description').textContent = t.labelDescription;
    document.getElementById('label-when').textContent        = t.labelWhen;
    document.getElementById('label-urgent').textContent      = t.labelUrgent;
    document.getElementById('label-urgent-desc').textContent = t.labelUrgentDesc;
    document.getElementById('description-input').placeholder = t.placeholderDesc;

    // Update issue cards
    document.getElementById('issue-title-ragging').textContent        = t.issueRagging;
    document.getElementById('issue-desc-ragging').textContent         = t.issueRaggingDesc;
    document.getElementById('issue-title-harassment').textContent     = t.issueHarassment;
    document.getElementById('issue-desc-harassment').textContent      = t.issueHarassmentDesc;
    document.getElementById('issue-title-corruption').textContent     = t.issueCorruption;
    document.getElementById('issue-desc-corruption').textContent      = t.issueCorruptionDesc;
    document.getElementById('issue-title-academic').textContent       = t.issueAcademic;
    document.getElementById('issue-desc-academic').textContent        = t.issueAcademicDesc;
    document.getElementById('issue-title-discrimination').textContent = t.issueDiscrimination;
    document.getElementById('issue-desc-discrimination').textContent  = t.issueDiscriminationDesc;
    document.getElementById('issue-title-other').textContent          = t.issueOther;
    document.getElementById('issue-desc-other').textContent           = t.issueOtherDesc;

    // RTL for Urdu
    document.body.style.direction = lang === 'ur' ? 'rtl' : 'ltr';
  }

  // ─── POPULATE REVIEW ───────────────────────────────────────────
  function populateReview() {
    const langNames = { en: 'English', hi: 'हिंदी', ur: 'اردو' };
    document.getElementById('review-type').textContent     = state.selectedType || '—';
    document.getElementById('review-lang').textContent     = langNames[state.selectedLang];
    document.getElementById('review-location').textContent = state.location || 'Not provided';
    document.getElementById('review-date').textContent     = state.date || 'Not provided';
    document.getElementById('review-urgent').textContent   = state.isUrgent ? '⚡ YES — Emergency' : 'No';
    document.getElementById('review-desc').textContent     = state.description;
  }

  // ─── SUBMIT LOGIC ─────────────────────────────────────────────
  function submitReport() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('active');

    const title = state.selectedType ? state.selectedType.toUpperCase() : 'ANONYMOUS REPORT';
    const reportPayload = {
      title: title,
      description: state.description,
      location: state.location || 'Not provided',
      isUrgent: state.isUrgent
    };

    fetch((window.API_BASE || '') + '/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('API failed');
      }
      return res.json();
    })
    .then(resData => {
      overlay.classList.remove('active');
      const data = resData.data;

      state.trackingId = data.trackingId;

      const colors = { Critical: '#f43f5e', High: '#f59e0b', Medium: '#8b5cf6', Low: '#10b981' };
      const color = colors[data.severity] || '#a78bfa';

      document.getElementById('tracking-id-display').textContent = data.trackingId;
      document.getElementById('result-category').textContent  = data.category;
      document.getElementById('result-severity').innerHTML    = `<span style="color:${color};font-weight:700">${data.severity}</span>`;
      document.getElementById('result-sentiment').textContent = data.sentiment || 'Fear';
      document.getElementById('result-summary').textContent   = data.summary || 'Summary compiled by AI.';

      if (data.passcode) {
        const passEl = document.createElement('div');
        passEl.className = 'passcode-note';
        passEl.style.cssText = 'margin-top:15px; font-size:0.95rem; color:#a78bfa; text-align:center; border: 1px dashed rgba(167,139,250,0.3); padding:12px; border-radius:8px; background: rgba(13,13,26,0.5); line-height: 1.5;';
        passEl.innerHTML = `🔑 <strong>Temporary Passcode:</strong> <code style="color:#fff; font-size:1.1rem; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; margin:0 4px">${data.passcode}</code><br/><small style="opacity:0.8; font-size:0.8rem">Write this passcode down. You will need it to track your report status and chat with admin.</small>`;
        document.getElementById('tracking-id-display').parentNode.appendChild(passEl);
      }

      goToStep(4);
      document.querySelector('.step-indicator').style.display = 'none';
    })
    .catch(err => {
      console.warn("Backend offline or error occurred. Falling back to local simulation...");
      overlay.classList.remove('active');

      const trackingId = generateTrackingId();
      state.trackingId = trackingId;

      const aiResult = getMockAIResult(state.selectedType, state.description);

      document.getElementById('tracking-id-display').textContent = trackingId;
      document.getElementById('result-category').textContent  = aiResult.category;
      document.getElementById('result-severity').innerHTML    = `<span style="color:${aiResult.color};font-weight:700">${aiResult.severity}</span>`;
      document.getElementById('result-sentiment').textContent = aiResult.sentiment;
      document.getElementById('result-summary').textContent   = aiResult.summary;

      goToStep(4);
      document.querySelector('.step-indicator').style.display = 'none';
    });
  }

  // ─── INIT EVENTS ─────────────────────────────────────────────
  function init() {

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyLanguage(btn.dataset.lang);
      });
    });

    // Issue type cards
    document.querySelectorAll('.issue-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.issue-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selectedType = card.dataset.type;
        document.getElementById('next-1').disabled = false;
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') card.click();
      });
    });

    // Description textarea — char counter + enable next
    const descInput = document.getElementById('description-input');
    const charCount = document.getElementById('char-count');
    const charHint  = document.getElementById('char-hint');
    const next2Btn  = document.getElementById('next-2');

    descInput.addEventListener('input', () => {
      const len = descInput.value.length;
      charCount.textContent = len;
      state.description = descInput.value;

      if (len >= 50) {
        charHint.textContent = '✓ Good detail!';
        charHint.classList.add('ok');
        next2Btn.disabled = false;
      } else {
        charHint.textContent = `(minimum 50 characters — ${50 - len} more)`;
        charHint.classList.remove('ok');
        next2Btn.disabled = true;
      }
    });

    // Location
    document.getElementById('location-input').addEventListener('input', e => {
      state.location = e.target.value;
    });

    // Date
    document.getElementById('date-input').addEventListener('change', e => {
      state.date = e.target.value;
    });

    // Urgency toggle
    document.getElementById('urgency-toggle').addEventListener('change', e => {
      state.isUrgent = e.target.checked;
    });

    // Step navigation
    document.getElementById('next-1').addEventListener('click', () => goToStep(2));
    document.getElementById('back-2').addEventListener('click', () => goToStep(1));
    document.getElementById('next-2').addEventListener('click', () => {
      populateReview();
      goToStep(3);
    });
    document.getElementById('back-3').addEventListener('click', () => goToStep(2));
    document.getElementById('submit-btn').addEventListener('click', submitReport);

    // New report button
    document.getElementById('new-report-btn').addEventListener('click', () => {
      location.reload();
    });

    // Copy tracking ID
    document.getElementById('copy-tracking-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(state.trackingId).then(() => {
        const btn = document.getElementById('copy-tracking-btn');
        btn.textContent = '✓ Copied!';
        btn.style.background = 'rgba(16,185,129,0.2)';
        btn.style.borderColor = 'rgba(16,185,129,0.4)';
        btn.style.color = '#34d399';
        setTimeout(() => {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy ID`;
          btn.style = '';
        }, 2000);
      });
    });

    // ─── CHATBOT ────────────────────────────────────────────────
    const chatbotToggle  = document.getElementById('chatbot-toggle');
    const chatbotWindow  = document.getElementById('chatbot-window');
    const chatbotInput   = document.getElementById('chatbot-input');
    const chatbotSend    = document.getElementById('chatbot-send');
    const chatMessages   = document.getElementById('chatbot-messages');
    const iconOpen  = chatbotToggle.querySelector('.chatbot-icon-open');
    const iconClose = chatbotToggle.querySelector('.chatbot-icon-close');
    const closeBtn  = document.getElementById('chatbot-close-btn');

    let chatOpen = false;

    function toggleChat() {
      chatOpen = !chatOpen;
      chatbotWindow.classList.toggle('open', chatOpen);
      iconOpen.style.display  = chatOpen ? 'none' : 'flex';
      iconClose.style.display = chatOpen ? 'flex' : 'none';
      if (chatOpen) {
        setTimeout(() => chatbotInput.focus(), 300);
        // Remove badge on first open
        const badge = chatbotToggle.querySelector('.chatbot-badge');
        if (badge) badge.remove();
      }
    }

    chatbotToggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send message
    function sendChatMessage(text) {
      if (!text.trim()) return;

      // Remove quick replies
      const qr = document.getElementById('quick-replies');
      if (qr) qr.remove();

      // Add user message
      addChatMsg(text, 'user');
      chatbotInput.value = '';

      // Add typing indicator
      const typingEl = addTypingIndicator();

      setTimeout(() => {
        typingEl.remove();
        const response = getChatResponse(text);
        addChatMsg(response, 'bot');
      }, 900 + Math.random() * 600);
    }

    function addChatMsg(text, role) {
      const now   = new Date();
      const time  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgEl = document.createElement('div');
      msgEl.className = `chat-msg ${role}`;
      msgEl.innerHTML = `
        <div class="chat-bubble">${text.replace(/\n/g, '<br/>')}</div>
        <div class="chat-time">${time}</div>
      `;
      chatMessages.appendChild(msgEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return msgEl;
    }

    function addTypingIndicator() {
      const el = document.createElement('div');
      el.className = 'chat-msg bot typing-indicator';
      el.innerHTML = `
        <div class="chat-bubble">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return el;
    }

    chatbotSend.addEventListener('click', () => sendChatMessage(chatbotInput.value));
    chatbotInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendChatMessage(chatbotInput.value);
    });

    // Quick reply buttons
    document.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => sendChatMessage(btn.dataset.msg));
    });

    // Open chatbot automatically after 4 seconds
    setTimeout(() => {
      if (!chatOpen) {
        const badge = chatbotToggle.querySelector('.chatbot-badge');
        if (badge) {
          badge.style.animation = 'none';
          badge.style.background = '#f43f5e';
          badge.style.transform = 'scale(1.2)';
          setTimeout(() => { badge.style.transform = ''; }, 300);
        }
      }
    }, 4000);
  }

  // ─── START ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    init();
    applyLanguage('en');
  });

})();
