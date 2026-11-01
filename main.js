gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  const colorTheme = document.querySelectorAll('input[name="theme"]');
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const initialLang = (
    localStorage.getItem("lang") ??
    navigator?.language ??
    "en"
  )
    .split("-")[0]
    .toLowerCase();

  const initialTheme =
    localStorage.getItem("theme") ?? (mediaQuery.matches ? "dark" : "light");

  document.documentElement.lang = initialLang;
  document.documentElement.setAttribute("data-theme", initialTheme);

  if (langSelect) langSelect.value = initialLang;

  const activeRadio = document.getElementById(initialTheme);
  if (activeRadio) activeRadio.checked = true;

  document.documentElement.setAttribute("data-theme", initialTheme);

  const countdownList = document.getElementById("countdown-list");
  const template = document.getElementById("unit-template");

  const units = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];

  const domElements = units.reduce((acc, unit) => {
    if (!template) return acc;

    const clone = template.content.cloneNode(true);
    const li = clone.querySelector(".countdown-unit");

    if (li) li.id = `${unit}-unit`;

    const digitsContainer = clone.querySelector(".countdown-digits");

    if (digitsContainer) digitsContainer.id = `${unit}-digits`;

    const labelSpan = clone.querySelector(".countdown-label");

    if (labelSpan) labelSpan.setAttribute("data-i18n", unit);

    acc[unit] = {
      digitsContainer,
      labelSpan,
    };

    if (countdownList) countdownList.appendChild(clone);

    return acc;
  }, {});

  const translateUI = (langCode) => {
    const currentI18n = getI18N(langCode);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const translationKey = element.getAttribute("data-i18n");

      if (translationKey && currentI18n[translationKey])
        element.textContent = currentI18n[translationKey];
    });
  };

  translateUI(initialLang);

  langSelect?.addEventListener("change", (e) => {
    const newLang = e.target.value;

    document.documentElement.lang = newLang;
    localStorage.setItem("lang", newLang);

    translateUI(newLang);
  });

  colorTheme.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        const newTheme = e.target.id;

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      }
    });
  });

  mediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const systemTheme = e.matches ? "dark" : "light";
      const systemRadio = document.getElementById(systemTheme);

      if (systemRadio) systemRadio.checked = true;

      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  });

  const updateDigit = (unit, value, padding = 2) => {
    const formattedValue = String(value).padStart(padding, "0");
    const dom = domElements[unit];

    if (!dom || !dom.digitsContainer) return;

    if (dom.accessibleSpan && dom.accessibleSpan.textContent !== formattedValue)
      dom.accessibleSpan.textContent = formattedValue;

    const elementChildren = dom.digitsContainer.children;

    for (let i = 0; i < formattedValue.length; i++) {
      const span = elementChildren[i];

      const currentText = span.dataset.val ?? span.textContent.trim();
      const newText = formattedValue[i];

      if (span && currentText !== newText) {
        const delay = i * 0.075;

        span.dataset.val = newText;

        span.innerHTML = `
          <div class="digit-track" style="display: flex; flex-direction: column; line-height: 1;">
            <span class="old-digit">${currentText}</span>
            <span class="new-digit">${newText}</span>
          </div>
        `;

        const track = span.querySelector(".digit-track");
        const oldDigit = span.querySelector(".old-digit");
        const newDigit = span.querySelector(".new-digit");

        gsap.to(track, {
          y: "-1em",
          duration: 0.4,
          ease: "hop",
          delay: delay,
          onComplete: () => (span.textContent = newText),
        });

        gsap.to(oldDigit, {
          opacity: 0,
          duration: 0.4,
          ease: "hop",
          delay: delay,
        });

        gsap.fromTo(
          newDigit,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "hop", delay: delay },
        );
      }
    }
  };

  const to = Temporal.ZonedDateTime.from("2027-06-25T18:30:00[Europe/Madrid]");

  const updateCountdown = () => {
    const from = Temporal.Now.zonedDateTimeISO();
    const duration = to.since(from, { largestUnit: "years" });

    if (duration.sign === -1) {
      if (countdownList) countdownList.hidden = true;

      const timesUpMsg = document.getElementById("times-up-message");
      if (timesUpMsg) timesUpMsg.hidden = false;

      clearInterval(countdownInterval);
      return;
    }

    const { years, months, hours, minutes, seconds } = duration;
    const weeks = Math.floor(duration.days / 7);
    const days = duration.days % 7;

    const values = {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
    };

    Object.entries(values).forEach(([unit, value]) =>
      updateDigit(unit, value, 2),
    );
  };

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
});
