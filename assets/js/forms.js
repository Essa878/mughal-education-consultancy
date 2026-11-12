/* ==========================================================================
   Mughal Education Consultants — enquiry forms
   Client-side validation, accessible errors and two delivery modes:
   1. Direct delivery when a form endpoint is configured in config.js
   2. A review-and-send panel (email / WhatsApp) when no endpoint is set
   ========================================================================== */

(function () {
  "use strict";

  var CONFIG = window.MT_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forms = document.querySelectorAll("form[data-form]");
  if (!forms.length) return;

  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function labelFor(control) {
    if (control.id) {
      var explicit = document.querySelector('label[for="' + CSS.escape(control.id) + '"]');
      if (explicit) return explicit.textContent.replace(/\*/g, "").trim();
    }
    var wrapping = control.closest("label");
    if (wrapping) return wrapping.textContent.replace(/\*/g, "").trim();
    return control.name
      ? control.name.replace(/[-_]/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); })
      : "Field";
  }

  function fieldWrapper(control) {
    return control.closest(".field");
  }

  function errorElement(control) {
    var wrapper = fieldWrapper(control);
    if (!wrapper) return null;
    return wrapper.querySelector(".field__error");
  }

  function setError(control, message) {
    var wrapper = fieldWrapper(control);
    var error = errorElement(control);
    if (!wrapper || !error) return;

    if (!error.id) error.id = (control.id || control.name || "field") + "-error";
    error.textContent = message;
    wrapper.classList.add("has-error");
    control.setAttribute("aria-invalid", "true");
    control.setAttribute("aria-describedby", error.id);
  }

  function clearError(control) {
    var wrapper = fieldWrapper(control);
    var error = errorElement(control);
    if (!wrapper || !error) return;
    wrapper.classList.remove("has-error");
    control.removeAttribute("aria-invalid");
    error.textContent = "";
  }

  function validate(control) {
    var value = control.type === "checkbox" ? control.checked : String(control.value || "").trim();
    var required = control.hasAttribute("required");

    if (control.type === "checkbox") {
      if (required && !value) return "Please tick this box so we can contact you about your enquiry.";
      return "";
    }

    if (required && !value) return "Please complete this field.";

    if (!value) return "";

    if (control.type === "email" && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) {
      return "Please enter a valid email address, for example name@example.com.";
    }

    if (control.type === "tel") {
      var count = digits(value).length;
      if (count < 7 || count > 16) return "Please enter a valid phone number including your country code.";
    }

    if (control.type === "number") {
      var num = Number(value);
      if (isNaN(num)) return "Please enter a number.";
      if (control.getAttribute("min") !== null && num < Number(control.min)) {
        return "Please enter " + control.min + " or more.";
      }
      if (control.getAttribute("max") !== null && num > Number(control.max)) {
        return "Please enter " + control.max + " or less.";
      }
    }

    if (control.tagName === "SELECT" && required && !value) {
      return "Please choose an option.";
    }

    if (control.minLength > 1 && value.length < control.minLength) {
      return "Please enter at least " + control.minLength + " characters.";
    }

    return "";
  }

  function collect(form) {
    var data = [];
    form.querySelectorAll("input, select, textarea").forEach(function (control) {
      if (!control.name || control.type === "submit" || control.type === "button") return;
      if (control.name === "consent" || control.name === "website") return;
      if (control.type === "checkbox" && !control.checked) return;
      var value = String(control.value || "").trim();
      if (!value) return;
      data.push({ label: labelFor(control), value: value });
    });
    return data;
  }

  function summaryText(form, data) {
    var title = form.getAttribute("data-subject") || "Website enquiry";
    var lines = ["Mughal Education Consultants — " + title, ""];
    data.forEach(function (row) {
      lines.push(row.label + ": " + row.value);
    });
    if (form.getAttribute("data-source")) {
      lines.push("", "Sent from: " + form.getAttribute("data-source"));
    }
    return lines.join("\n");
  }

  function statusBox(form) {
    var scope = form.closest(".form-card") || form.parentElement;
    return scope ? scope.querySelector("[data-form-status]") : null;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function copyText(text, button) {
    var original = button.textContent;

    function confirmCopied() {
      button.textContent = "Copied";
      button.classList.add("is-copied");
      window.setTimeout(function () {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 2000);
    }

    function legacyCopy() {
      var helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.top = "-1000px";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try {
        if (document.execCommand("copy")) confirmCopied();
      } catch (error) {
        /* Clipboard unavailable — the text stays selected for manual copying. */
      }
      document.body.removeChild(helper);
    }

    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(confirmCopied).catch(legacyCopy);
    } else {
      legacyCopy();
    }
  }

  function wireCopyButtons(box, summary, email) {
    Array.prototype.forEach.call(box.querySelectorAll("[data-copy]"), function (button) {
      button.addEventListener("click", function () {
        copyText(button.getAttribute("data-copy") === "email" ? email : summary, button);
      });
    });
  }

  function showStatus(form, options) {
    var box = statusBox(form);
    if (!box) return;

    box.classList.add("is-visible");
    box.classList.toggle("form-status--error", !!options.error);
    box.innerHTML =
      '<div class="form-status__head">' +
      '<span class="form-status__icon" aria-hidden="true">' +
      (options.error
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5 5L20 6"/></svg>') +
      "</span>" +
      "<div><h3 tabindex=\"-1\">" + options.title + "</h3><p>" + options.message + "</p></div>" +
      "</div>" +
      (options.actions ? '<div class="form-status__actions">' + options.actions + "</div>" : "") +
      (options.note ? '<p class="form-note">' + options.note + "</p>" : "");

    wireCopyButtons(box, options.summary || "", CONFIG.email || "");

    var heading = box.querySelector("h3");
    if (heading) heading.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  function fallbackActions(form, summary) {
    var email = CONFIG.email || "";
    var number = digits(CONFIG.whatsapp);
    var subject = "Mughal Education Consultants — " + (form.getAttribute("data-subject") || "Website enquiry");
    var actions = "";

    if (email) {
      var mailto =
        "mailto:" + email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(summary);
      actions +=
        '<a class="btn btn--gold btn--sm" href="' + escapeHtml(mailto) + '">Send by email</a>';
    }

    if (number) {
      actions +=
        '<a class="btn btn--whatsapp btn--sm" href="https://wa.me/' + number +
        "?text=" + encodeURIComponent(summary).replace(/"/g, "&quot;") +
        '" target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>';
    }

    if (email) {
      var gmail =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" + encodeURIComponent(email) +
        "&su=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(summary);
      actions +=
        '<div class="send-fallback">' +
        '<p class="send-fallback__label">Did nothing open? Some computers have no email app set up. ' +
        "Copy your enquiry below, then email it to <strong>" + escapeHtml(email) + "</strong> from any email service.</p>" +
        '<textarea class="send-fallback__body" readonly rows="6" aria-label="Your enquiry, ready to copy">' +
        escapeHtml(summary) +
        "</textarea>" +
        '<div class="send-fallback__actions">' +
        '<button type="button" class="btn btn--outline btn--sm" data-copy="summary">Copy enquiry</button>' +
        '<button type="button" class="btn btn--outline btn--sm" data-copy="email">Copy email address</button>' +
        '<a class="btn btn--ghost btn--sm" href="' + escapeHtml(gmail) +
        '" target="_blank" rel="noopener noreferrer">Open Gmail instead</a>' +
        "</div>" +
        "</div>";
    }

    return actions;
  }

  function setBusy(form, busy) {
    var button = form.querySelector('[type="submit"]');
    if (!button) return;
    if (busy) {
      if (!button.getAttribute("data-label")) button.setAttribute("data-label", button.innerHTML);
      button.disabled = true;
      button.innerHTML = "Sending…";
    } else {
      button.disabled = false;
      if (button.getAttribute("data-label")) button.innerHTML = button.getAttribute("data-label");
    }
    form.setAttribute("aria-busy", busy ? "true" : "false");
  }

  function resetAndConfirm(form, message) {
    form.reset();
    form.querySelectorAll(".field").forEach(function (field) {
      field.classList.remove("has-error");
    });
    var number = digits(CONFIG.whatsapp);
    var waHref = number
      ? "https://wa.me/" +
        number +
        "?text=" +
        encodeURIComponent(
          "Hello Mughal Education Consultants, I have just submitted an enquiry through your website and would like to discuss it."
        )
      : "contact.html";
    showStatus(form, {
      title: "Thank you — your enquiry has been received",
      message: message,
      actions:
        '<a class="btn btn--whatsapp btn--sm" href="' +
        waHref +
        '" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>' +
        '<a class="btn btn--outline btn--sm" href="index.html">Back to Home</a>',
      note: "We aim to reply during normal business hours. Please do not send passport copies or financial documents through this form."
    });
  }

  function setupForm(form) {
    form.setAttribute("novalidate", "novalidate");

    var controls = Array.prototype.slice.call(
      form.querySelectorAll("input:not([type=hidden]), select, textarea")
    );

    controls.forEach(function (control) {
      if (control.closest(".hp-field")) return;
      var eventName = control.type === "checkbox" || control.tagName === "SELECT" ? "change" : "input";
      control.addEventListener(eventName, function () {
        if (fieldWrapper(control) && fieldWrapper(control).classList.contains("has-error")) {
          if (!validate(control)) clearError(control);
        }
      });
      control.addEventListener("blur", function () {
        if (!String(control.value || "").trim() && !control.hasAttribute("required")) return;
        var message = validate(control);
        if (message) setError(control, message);
        else clearError(control);
      });
    });

    var today = new Date().toISOString().slice(0, 10);
    var dob = form.querySelector('input[name="date_of_birth"]');
    if (dob) dob.setAttribute("max", today);
    form.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (input === dob) return;
      if (!input.getAttribute("min")) input.setAttribute("min", today);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (form.getAttribute("aria-busy") === "true") return;

      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      var firstInvalid = null;
      controls.forEach(function (control) {
        if (control.closest(".hp-field")) return;
        var message = validate(control);
        if (message) {
          setError(control, message);
          if (!firstInvalid) firstInvalid = control;
        } else {
          clearError(control);
        }
      });

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        firstInvalid.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        return;
      }

      var data = collect(form);
      var summary = summaryText(form, data);

      if (!CONFIG.formEndpoint) {
        showStatus(form, {
          title: "Your enquiry is ready to send",
          message:
            "Thank you, " + (data[0] ? data[0].value.split(" ")[0] : "") +
            ". Choose how you would like to send your details to our team — email or WhatsApp.",
          actions: fallbackActions(form, summary),
          summary: summary,
          note:
            "Nothing has been stored on this website. “Send by email” opens your own email app with the message ready to review. If it does not open, copy your enquiry above and send it from your usual email service."
        });
        return;
      }

      setBusy(form, true);

      var payload = {
        subject: "Mughal Education Consultants — " + (form.getAttribute("data-subject") || "Website enquiry"),
        from_name: "Mughal Education Consultants website",
        page: window.location.href
      };

      if (CONFIG.formAccessKey) payload.access_key = CONFIG.formAccessKey;
      data.forEach(function (row) { payload[row.label] = row.value; });

      fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (body) {
            return { ok: response.ok, body: body };
          });
        })
        .then(function (result) {
          if (!result.ok || result.body.success === false) throw new Error("Submission failed");
          setBusy(form, false);
          resetAndConfirm(
            form,
            "Your details have been sent to our team. We will contact you using the phone number or email address you provided."
          );
        })
        .catch(function () {
          setBusy(form, false);
          showStatus(form, {
            title: "We could not send your enquiry automatically",
            message: "Please send your enquiry directly using one of the options below. Your details are still in the form, so nothing has been lost.",
            actions: fallbackActions(form, summary),
            summary: summary,
            note: "You can also call us during business hours.",
            error: true
          });
        });
    });

    // Pre-select a university or study level from a link (e.g. university pages).
    var params = new URLSearchParams(window.location.search);
    var university = params.get("university");
    var level = params.get("level");
    if (university) {
      var uniSelect = form.querySelector('select[name="university"]');
      if (uniSelect) {
        Array.prototype.forEach.call(uniSelect.options, function (option) {
          if (option.value.toLowerCase() === university.toLowerCase()) uniSelect.value = option.value;
        });
      }
    }
    if (level) {
      var levelSelect = form.querySelector('select[name="level"]');
      if (levelSelect) {
        Array.prototype.forEach.call(levelSelect.options, function (option) {
          if (option.value.toLowerCase() === level.toLowerCase()) levelSelect.value = option.value;
        });
      }
    }
  }

  forms.forEach(setupForm);
})();
