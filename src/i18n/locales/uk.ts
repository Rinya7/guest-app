// Українська локалізація для гостьового додатку
const uk = {
  common: {
    language: "Мова",
    loading: "Завантаження...",
    error: "Помилка",
    retry: "Спробувати ще раз",
    back: "Назад",
    copy: "Копіювати",
    show: "Показати",
    hide: "Приховати",
    copied: "Скопійовано в буфер обміну",
    copyFailed: "Не вдалося скопіювати",
    notSpecified: "Не вказано",
    notFound: "Дані не знайдено",
  },
  loader: {
    default: "Завантаження...",
    stayInfo: "Отримання інформації про проживання...",
    redirecting: "Перенаправлення...",
  },
  error: {
    tokenNotSpecified: "Токен доступу не вказано. Будь ласка, використовуйте посилання з токеном.",
    unknownStatus: "Невідомий статус проживання",
  },
  stay: {
    title: "Інформація про проживання",
    roomNumber: "Номер кімнати",
    status: "Статус",
    dates: "Дати проживання",
    checkIn: "Заїзд",
    checkOut: "Виїзд",
    after: "Після",
    until: "До",
    guests: "Гості",
    extraGuests: "Додаткові гості:",
    wifiInfo: "Wi-Fi інформація",
    contacts: "Контакти готелю",
    backToStay: "← Назад до інформації про проживання",
  },
  status: {
    booked: "Бронювання підтверджено",
    occupied: "Гість заселений",
    completed: "Проживання завершено",
    cancelled: "Бронювання скасовано",
  },
  wifi: {
    title: "Wi-Fi інформація",
    notAvailable: "Wi-Fi інформація буде доступна після заселення",
    notConfigured: "Wi-Fi інформація не налаштована для цього номера",
    networkName: "Назва мережі (SSID)",
    password: "Пароль",
  },
  contact: {
    title: "Контакти",
    address: "Адреса готелю",
    phone: "Телефон",
    email: "Email",
    notProvided: "Контактна інформація не надана",
    contactForCancellation: "Якщо у вас є питання щодо скасування, будь ласка, зв'яжіться з нами:",
  },
  completed: {
    title: "Дякуємо за проживання!",
    message: "Ваше перебування завершено.",
    stayInfo: "Інформація про проживання",
    hotel: "Готель",
  },
  cancelled: {
    title: "Бронювання скасовано",
    message: "Ваше бронювання було скасовано.",
    bookingInfo: "Інформація про бронювання",
    hotel: "Готель",
  },
  layout: {
    footer: "Hotel Guest App",
  },
} as const;

export default uk;

