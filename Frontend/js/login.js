// Admin Login Logic — Gyanix AI
// Written by: Dev Team
// Last updated: Dec 2024

// valid admin accounts (in real app, this hits backend API)
const ADMIN_ACCOUNTS = [
  {
    email: "admin@gyanix.ai",
    password: "Admin@123",
    name: "Super Admin",
    role: "super_admin"
  },
  {
    email: "principal@gyanix.ai",
    password: "Principal@2024",
    name: "Principal",
    role: "principal"
  }
];

// track failed attempts
let failedAttempts = 0;
const MAX_ATTEMPTS = 5;
let isLocked = false;

// ---- grab elements ----
const form        = document.getElementById("login-form");
const emailInput  = document.getElementById("admin-email");
const passInput   = document.getElementById("admin-password");
const loginBtn    = document.getElementById("login-btn");
const btnText     = document.getElementById("btn-text");
const btnSpinner  = document.getElementById("btn-spinner");
const btnArrow    = document.getElementById("btn-arrow");
const alertBox    = document.getElementById("login-alert");
const alertText   = document.getElementById("alert-text");
const successBox  = document.getElementById("login-success");
const attemptInfo = document.getElementById("attempt-info");
const attemptText = document.getElementById("attempt-text");
const togglePass  = document.getElementById("toggle-pass");
const eyeOpen     = document.getElementById("eye-open");
const eyeClosed   = document.getElementById("eye-closed");

// ---- check if already logged in ----
window.addEventListener("DOMContentLoaded", function () {
  var session = sessionStorage.getItem("gyanix_admin");
  var remember = localStorage.getItem("gyanix_admin_remember");

  if (session || remember) {
    // already logged in, go to dashboard
    window.location.href = "dashboard.html";
    return;
  }

  // pre-fill email if remembered
  var savedEmail = localStorage.getItem("gyanix_remember_email");
  if (savedEmail) {
    emailInput.value = savedEmail;
    document.getElementById("remember-me").checked = true;
  }

  // click-to-copy demo credentials
  document.querySelectorAll(".demo-val").forEach(function(el) {
    el.addEventListener("click", function() {
      var text = el.textContent.trim();
      navigator.clipboard.writeText(text).then(function() {
        var orig = el.textContent;
        el.textContent = "Copied!";
        el.style.background = "rgba(16,185,129,0.2)";
        el.style.color = "#34d399";
        setTimeout(function() {
          el.textContent = orig;
          el.style.background = "";
          el.style.color = "";
        }, 1500);
      });
    });
  });
});

// ---- show/hide password ----
togglePass.addEventListener("click", function() {
  if (passInput.type === "password") {
    passInput.type = "text";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  } else {
    passInput.type = "password";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  }
});

// ---- real-time validation ----
emailInput.addEventListener("blur", function() {
  validateEmail();
});

passInput.addEventListener("blur", function() {
  validatePassword();
});

// clear error on typing
emailInput.addEventListener("input", function() {
  clearError("group-email", "email-error");
  hideAlert();
});

passInput.addEventListener("input", function() {
  clearError("group-password", "password-error");
  hideAlert();
});

function validateEmail() {
  var val = emailInput.value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!val) {
    showFieldError("group-email", "email-error", "Email address is required");
    return false;
  }
  if (!emailRegex.test(val)) {
    showFieldError("group-email", "email-error", "Please enter a valid email address");
    return false;
  }

  emailInput.classList.remove("error");
  emailInput.classList.add("success");
  return true;
}

function validatePassword() {
  var val = passInput.value;

  if (!val) {
    showFieldError("group-password", "password-error", "Password is required");
    return false;
  }
  if (val.length < 6) {
    showFieldError("group-password", "password-error", "Password must be at least 6 characters");
    return false;
  }

  passInput.classList.remove("error");
  passInput.classList.add("success");
  return true;
}

function showFieldError(groupId, errorId, msg) {
  var input = document.querySelector("#" + groupId + " .lf-input");
  var errEl = document.getElementById(errorId);
  if (input) { input.classList.add("error"); input.classList.remove("success"); }
  if (errEl) { errEl.textContent = msg; errEl.classList.add("show"); }
}

function clearError(groupId, errorId) {
  var input = document.querySelector("#" + groupId + " .lf-input");
  var errEl = document.getElementById(errorId);
  if (input) input.classList.remove("error");
  if (errEl) errEl.classList.remove("show");
}

function showAlert(msg) {
  alertText.textContent = msg;
  alertBox.classList.add("show");
  successBox.classList.remove("show");
  // shake the card
  var card = document.querySelector(".login-card");
  card.style.animation = "none";
  card.offsetHeight; // reflow trick
  card.style.animation = "shakeCard 0.4s ease";
}

function hideAlert() {
  alertBox.classList.remove("show");
}

function showSuccess() {
  successBox.classList.add("show");
  alertBox.classList.remove("show");
}

// ---- form submit ----
form.addEventListener("submit", function(e) {
  e.preventDefault();

  if (isLocked) {
    showAlert("Account temporarily locked. Try again after 5 minutes.");
    return;
  }

  var emailOk = validateEmail();
  var passOk  = validatePassword();

  if (!emailOk || !passOk) return;

  // show loading state
  setLoading(true);

  // Try real API call first
  fetch((window.API_BASE || '') + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailInput.value.trim().toLowerCase(), password: passInput.value })
  })
  .then(function(res) {
    if (!res.ok) {
      return res.json().then(function(errData) {
        throw new Error(errData.message || 'Login failed');
      });
    }
    return res.json();
  })
  .then(function(resData) {
    var user = resData.data.user;
    var sessionData = JSON.stringify({
      name: user.name,
      role: user.role,
      email: user.email,
      token: resData.data.token, // Store JWT token!
      loginTime: new Date().toISOString()
    });
    loginSuccess(sessionData, user.name, user.role, user.email);
    setLoading(false);
  })
  .catch(function(err) {
    // If it's a network error (backend offline), fall back to local authentication
    if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
      console.warn("Backend offline, falling back to local simulation...");
      var email = emailInput.value.trim().toLowerCase();
      var password = passInput.value;
      var matchedUser = ADMIN_ACCOUNTS.find(function(acc) {
        return acc.email.toLowerCase() === email && acc.password === password;
      });
      if (matchedUser) {
        var sessionData = JSON.stringify({
          name: matchedUser.name,
          role: matchedUser.role,
          email: matchedUser.email,
          loginTime: new Date().toISOString()
        });
        loginSuccess(sessionData, matchedUser.name, matchedUser.role, matchedUser.email);
      } else {
        loginFailed();
      }
    } else {
      showAlert(err.message);
    }
    setLoading(false);
  });
});

function loginSuccess(sessionData, name, role, email) {
  failedAttempts = 0;

  // save session
  sessionStorage.setItem("gyanix_admin", sessionData);

  // remember me
  var rememberMe = document.getElementById("remember-me").checked;
  if (rememberMe) {
    localStorage.setItem("gyanix_admin_remember", sessionData);
    localStorage.setItem("gyanix_remember_email", email);
  } else {
    localStorage.removeItem("gyanix_admin_remember");
    localStorage.removeItem("gyanix_remember_email");
  }

  showSuccess();

  // change button to success state
  loginBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
  loginBtn.style.boxShadow  = "0 8px 28px rgba(16,185,129,0.4)";
  btnText.textContent = "Login Successful!";
  btnArrow.style.display = "none";

  // redirect after short delay
  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1400);
}

function loginFailed() {
  failedAttempts++;
  var remaining = MAX_ATTEMPTS - failedAttempts;

  if (failedAttempts >= MAX_ATTEMPTS) {
    // lock account
    isLocked = true;
    loginBtn.disabled = true;
    loginBtn.classList.add("locked");
    btnText.textContent = "🔒 Account Locked (5 min)";
    showAlert("Too many failed attempts. Account locked for 5 minutes.");
    attemptInfo.style.display = "none";

    // unlock after 5 min
    setTimeout(function() {
      isLocked = false;
      failedAttempts = 0;
      loginBtn.disabled = false;
      loginBtn.classList.remove("locked");
      loginBtn.style = "";
      btnText.textContent = "Login to Dashboard";
      hideAlert();
    }, 5 * 60 * 1000);

    return;
  }

  // wrong password message
  var messages = [
    "Invalid email or password. Please try again.",
    "Incorrect credentials. Double-check and try again.",
    "Wrong email or password.",
  ];
  var msg = messages[Math.floor(Math.random() * messages.length)];
  showAlert(msg);

  // show attempt counter after 2nd fail
  if (failedAttempts >= 2) {
    attemptInfo.style.display = "flex";
    attemptText.textContent = remaining + " attempt" + (remaining === 1 ? "" : "s") + " remaining before account lockout";
  }

  // clear password field
  passInput.value = "";
  passInput.classList.remove("success");
  passInput.focus();
}

function setLoading(loading) {
  if (loading) {
    loginBtn.disabled = true;
    btnText.textContent = "Verifying...";
    btnSpinner.classList.add("show");
    btnArrow.style.display = "none";
  } else {
    loginBtn.disabled = false;
    if (!isLocked && !successBox.classList.contains("show")) {
      btnText.textContent = "Login to Dashboard";
    }
    btnSpinner.classList.remove("show");
    btnArrow.style.display = "";
  }
}

// ---- keyboard shortcut ----
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && document.activeElement !== loginBtn) {
    form.dispatchEvent(new Event("submit"));
  }
});

// add shake animation to stylesheet
var shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shakeCard {
    0%  { transform: translateX(0); }
    15% { transform: translateX(-8px); }
    30% { transform: translateX(8px); }
    45% { transform: translateX(-6px); }
    60% { transform: translateX(6px); }
    75% { transform: translateX(-3px); }
    90% { transform: translateX(3px); }
    100%{ transform: translateX(0); }
  }
`;
document.head.appendChild(shakeStyle);