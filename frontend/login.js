document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signinForm');
  const phone = document.getElementById('phone');
  const password = document.getElementById('password');
  const submitBtn = document.getElementById('submitBtn');
  const phoneErr = document.getElementById('phoneErr');
  const passErr = document.getElementById('passErr');

  // Store original button HTML for reset
  const originalBtnHTML = submitBtn.innerHTML;

  function getCurrentTranslations() {
    const lang = localStorage.getItem('site_language') || 'en';
    return window._translations ? (window._translations[lang] || window._translations.en) : { signInBtn: 'Sign In', signingAlert: 'Signing in...' };
  }

  function validatePhone() {
    const v = phone.value.trim();
    const ok = /^\d{10}$/.test(v);
    phoneErr.classList.toggle('d-none', ok);
    phone.classList.toggle('is-invalid', !ok);
    return ok;
  }

  function validatePass() {
    const ok = password.value.length >= 8;
    passErr.classList.toggle('d-none', ok);
    password.classList.toggle('is-invalid', !ok);
    return ok;
  }

  function updateSubmit() {
    const valid = validatePhone() && validatePass();
    submitBtn.disabled = !valid;
  }

  phone.addEventListener('input', updateSubmit);
  password.addEventListener('input', updateSubmit);

  // Initial validation
  updateSubmit();

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopImmediatePropagation(); // Prevent other submit handlers (e.g., inline script) from running

    if (!validatePhone() || !validatePass()) return;

    const T = getCurrentTranslations();
    const signingText = T.signingAlert || 'Signing in...';
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + signingText;
    submitBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_no: phone.value.trim(),
          password: password.value
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && (data === true || data.success === true)) {
        // On success, optionally handle token if returned
        // if (data.token) localStorage.setItem('token', data.token);
        
        // Redirect after a short delay to show the message
        setTimeout(() => {
          window.location.href = 'next.html';
        }, 1000);
      } else {
        alert('Please enter the correct phone number and password');
        resetButton();
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server is under maintance , please check after sometime.');
      resetButton();
    }

    function resetButton() {
      const resetT = getCurrentTranslations();
      submitBtn.innerHTML = '<i class="fa fa-tractor me-2" aria-hidden="true"></i><span>' + (resetT.signInBtn || 'Sign In') + '</span>';
      submitBtn.disabled = false;
    }
  });

  // Enter key support
  [phone, password].forEach(input => {
    input.addEventListener('keydown', function(ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        if (!submitBtn.disabled) form.requestSubmit();
      }
    });
  });
});