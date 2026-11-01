const english = {
  title: "Countdown",
  years: "years",
  months: "months",
  weeks: "weeks",
  days: "days",
  hours: "hours",
  minutes: "minutes",
  seconds: "seconds",
  timesUp: "Time's up!",
  colorPicker: "Toggle theme",
  light: "light",
  dark: "dark",
  langSwitch: "Choose language",
  en: "English",
  es: "Spanish",
  eu: "Basque",
};

const spanish = {
  title: "Cuenta atrás",
  years: "años",
  months: "meses",
  weeks: "semanas",
  days: "días",
  hours: "horas",
  minutes: "minutos",
  seconds: "segundos",
  timesUp: "¡El gran día ha llegado!",
  colorPicker: "Cambiar tema",
  light: "claro",
  dark: "oscuro",
  langSwitch: "Elige idioma",
  en: "Inglés",
  es: "Español",
  eu: "Euskera",
};

const basque = {
  title: "Atzerako kontaketa",
  years: "urte",
  months: "hilabete",
  weeks: "aste",
  days: "egun",
  hours: "ordu",
  minutes: "minutu",
  seconds: "segundo",
  timesUp: "Iritsi da ordua!",
  colorPicker: "Gaia aldatu",
  light: "argia",
  dark: "iluna",
  langSwitch: "Hizkuntza aukeratu",
  en: "Ingelesa",
  es: "Gaztelania",
  eu: "Euskera",
};

const dictionaries = {
  en: english,
  es: spanish,
  eu: basque,
};

const getI18N = (locale) => {
  const langCode = locale.split("-")[0].toLowerCase();

  return dictionaries[langCode] ?? english;
};
