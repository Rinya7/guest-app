// English localization for guest app
const en = {
  common: {
    language: "Language",
    loading: "Loading...",
    error: "Error",
    retry: "Try again",
    back: "Back",
    copy: "Copy",
    show: "Show",
    hide: "Hide",
    copied: "Copied to clipboard",
    copyFailed: "Failed to copy",
    notSpecified: "Not specified",
    notFound: "Data not found",
  },
  loader: {
    default: "Loading...",
    stayInfo: "Retrieving stay information...",
    redirecting: "Redirecting...",
  },
  error: {
    tokenNotSpecified: "Access token not specified. Please use a link with a token.",
    unknownStatus: "Unknown stay status",
  },
  stay: {
    title: "Stay Information",
    roomNumber: "Room Number",
    status: "Status",
    dates: "Stay Dates",
    checkIn: "Check-in",
    checkOut: "Check-out",
    after: "After",
    until: "Until",
    guests: "Guests",
    extraGuests: "Additional guests:",
    wifiInfo: "Wi-Fi Information",
    contacts: "Hotel Contacts",
    backToStay: "← Back to stay information",
  },
  status: {
    booked: "Booking confirmed",
    occupied: "Guest checked in",
    completed: "Stay completed",
    cancelled: "Booking cancelled",
  },
  wifi: {
    title: "Wi-Fi Information",
    notAvailable: "Wi-Fi information will be available after check-in",
    notConfigured: "Wi-Fi information is not configured for this room",
    networkName: "Network Name (SSID)",
    password: "Password",
  },
  contact: {
    title: "Contacts",
    address: "Hotel Address",
    phone: "Phone",
    email: "Email",
    notProvided: "Contact information not provided",
    contactForCancellation: "If you have questions about the cancellation, please contact us:",
  },
  completed: {
    title: "Thank you for your stay!",
    message: "Your stay has been completed.",
    stayInfo: "Stay Information",
    hotel: "Hotel",
  },
  cancelled: {
    title: "Booking Cancelled",
    message: "Your booking has been cancelled.",
    bookingInfo: "Booking Information",
    hotel: "Hotel",
  },
  layout: {
    footer: "Hotel Guest App",
  },
} as const;

export default en;





