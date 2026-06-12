// Contact form validation and submission
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  var success = document.getElementById('contact-success');
  var errorEl = document.getElementById('form-error');
  var submitBtn = document.getElementById('form-submit');
  var resetBtn = document.getElementById('form-reset');

  var nameField = document.getElementById('field-name');
  var emailField = document.getElementById('field-email');
  var companyField = document.getElementById('field-company');
  var messageField = document.getElementById('field-message');

  function clearError() { errorEl.hidden = true; errorEl.textContent = ''; }
  nameField.addEventListener('input', clearError);
  emailField.addEventListener('input', clearError);
  messageField.addEventListener('input', clearError);

  submitBtn.addEventListener('click', function () {
    var name = nameField.value.trim();
    var email = emailField.value.trim();
    var message = messageField.value.trim();

    if (!name) {
      errorEl.textContent = 'Please tell us your name.';
      errorEl.hidden = false;
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.hidden = false;
      return;
    }
    if (!message) {
      errorEl.textContent = 'A sentence about what you\u2019re stuck on helps us prepare for the call.';
      errorEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'e2099520-2b88-43d9-8d4b-af654b4cd96e',
        botcheck: document.getElementById('botcheck').value,
        name: name,
        email: email,
        company: companyField.value.trim(),
        message: message,
        subject: 'New inquiry from ' + name
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed');
      form.hidden = true;
      success.hidden = false;
    }).catch(function () {
      errorEl.textContent = 'Something went wrong — please try again or email us directly.';
      errorEl.hidden = false;
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request the free call';
    });
  });

  resetBtn.addEventListener('click', function () {
    nameField.value = '';
    emailField.value = '';
    companyField.value = '';
    messageField.value = '';
    clearError();
    success.hidden = true;
    form.hidden = false;
  });
})();
