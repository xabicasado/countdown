if (typeof Temporal === "undefined") {
  window.Temporal = {
    Now: {
      zonedDateTimeISO: () => new FakeZonedDateTime(new Date()),
    },
    ZonedDateTime: {
      from: (isoString) => {
        const cleanString = isoString.replace(/\[.*\]/, "");
        return new FakeZonedDateTime(new Date(cleanString));
      },
    },
  };

  class FakeZonedDateTime {
    constructor(date) {
      this.date = date;
    }

    since(fromZonedDateTime) {
      const from = fromZonedDateTime.date;
      const to = this.date;

      const diffMs = to.getTime() - from.getTime();
      if (diffMs <= 0) return { sign: -1 };

      let years = to.getFullYear() - from.getFullYear();
      let months = to.getMonth() - from.getMonth();
      let days = to.getDate() - from.getDate();
      let hours = to.getHours() - from.getHours();
      let minutes = to.getMinutes() - from.getMinutes();
      let seconds = to.getSeconds() - from.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const daysInPrevMonth = new Date(
          to.getFullYear(),
          to.getMonth(),
          0,
        ).getDate();
        days += daysInPrevMonth;
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      return {
        sign: 1,
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
      };
    }
  }
}
