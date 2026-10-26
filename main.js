gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

document.addEventListener("DOMContentLoaded", () => {
  const countdownSection = document.getElementById("countdown");
  const to = Temporal.ZonedDateTime.from("2027-06-25T18:30:00[Europe/Madrid]");

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
    acc[unit] = {
      digitsContainer: document.getElementById(`${unit}-digits`),
      accessibleSpan: document.querySelector(
        `#${unit}-unit .countdown-accessible-value`,
      ),
    };
    return acc;
  }, {});

  const updateDigit = (unit, value, padding = 2) => {
    const formattedValue = String(value).padStart(padding, "0");
    const dom = domElements[unit];

    if (!dom.digitsContainer) return;

    if (dom.accessibleSpan && dom.accessibleSpan.textContent !== formattedValue)
      dom.accessibleSpan.textContent = formattedValue;

    const elementChildren = dom.digitsContainer.children;

    for (let i = 0; i < formattedValue.length; i++) {
      const span = elementChildren[i];

      if (span && span.textContent !== formattedValue[i]) {
        const delay = i * 0.075;

        gsap.to(span, {
          duration: 0.4,
          ease: "hop",
          delay: delay,

          onComplete: () => {
            span.textContent = formattedValue[i];

            gsap.fromTo(
              span,
              { y: "100%" },
              { y: "0%", duration: 0.4, ease: "hop" },
            );
          },
        });
      }
    }
  };

  const updateCountdown = () => {
    const from = Temporal.Now.zonedDateTimeISO();

    const duration = to.since(from, { largestUnit: "years" });

    if (duration.sign === -1) {
      countdownSection.innerHTML = "Time's up!";
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
