// Deutsche Lokalisierung für Gäste-App
const de = {
  common: {
    language: "Sprache",
    loading: "Laden...",
    error: "Fehler",
    retry: "Erneut versuchen",
    back: "Zurück",
    copy: "Kopieren",
    show: "Anzeigen",
    hide: "Verbergen",
    copied: "In Zwischenablage kopiert",
    copyFailed: "Kopieren fehlgeschlagen",
    notSpecified: "Nicht angegeben",
    notFound: "Daten nicht gefunden",
  },
  loader: {
    default: "Laden...",
    stayInfo: "Aufenthaltsinformationen werden abgerufen...",
    redirecting: "Weiterleitung...",
  },
  error: {
    tokenNotSpecified: "Zugriffstoken nicht angegeben. Bitte verwenden Sie einen Link mit einem Token.",
    unknownStatus: "Unbekannter Aufenthaltsstatus",
  },
  stay: {
    title: "Aufenthaltsinformationen",
    roomNumber: "Zimmernummer",
    status: "Status",
    dates: "Aufenthaltsdaten",
    checkIn: "Check-in",
    checkOut: "Check-out",
    after: "Nach",
    until: "Bis",
    guests: "Gäste",
    extraGuests: "Zusätzliche Gäste:",
    wifiInfo: "Wi-Fi-Informationen",
    contacts: "Hotelkontakte",
    backToStay: "← Zurück zu Aufenthaltsinformationen",
  },
  status: {
    booked: "Buchung bestätigt",
    occupied: "Gast eingecheckt",
    completed: "Aufenthalt abgeschlossen",
    cancelled: "Buchung storniert",
  },
  wifi: {
    title: "Wi-Fi-Informationen",
    notAvailable: "Wi-Fi-Informationen sind nach dem Check-in verfügbar",
    notConfigured: "Wi-Fi-Informationen sind für dieses Zimmer nicht konfiguriert",
    networkName: "Netzwerkname (SSID)",
    password: "Passwort",
  },
  contact: {
    title: "Kontakte",
    address: "Hoteladresse",
    phone: "Telefon",
    email: "E-Mail",
    notProvided: "Kontaktinformationen nicht bereitgestellt",
    contactForCancellation: "Wenn Sie Fragen zur Stornierung haben, kontaktieren Sie uns bitte:",
  },
  completed: {
    title: "Vielen Dank für Ihren Aufenthalt!",
    message: "Ihr Aufenthalt wurde abgeschlossen.",
    stayInfo: "Aufenthaltsinformationen",
    hotel: "Hotel",
  },
  cancelled: {
    title: "Buchung storniert",
    message: "Ihre Buchung wurde storniert.",
    bookingInfo: "Buchungsinformationen",
    hotel: "Hotel",
  },
  layout: {
    footer: "Hotel Guest App",
  },
} as const;

export default de;





