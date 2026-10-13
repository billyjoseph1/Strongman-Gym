/* ==========================================================
   STRONGMAN GYM — site settings
   Edit these values once and every page updates.
   ========================================================== */
window.GYM = {
  name: "Strongman Gym",
  tagline: "Lift Heavy. Live Strong.",
  phone: "+254 712 345 678",          // shown on the site
  whatsapp: "254712345678",            // digits only, with country code
  email: "info@strongmangym.co.ke",
  address: "Ngong Road, opposite Prestige Plaza, Nairobi, Kenya",
  mapQuery: "Ngong Road, Nairobi, Kenya", // used for the Google map on Contact page
  mpesaPaybill: "522522",
  mpesaAccount: "STRONG + your phone number",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/"
  },
  // Opening hours, 24h clock. Index 0 = Sunday ... 6 = Saturday. null = closed.
  hours: [
    { day: "Sunday",    open: "07:00", close: "14:00" },
    { day: "Monday",    open: "05:00", close: "22:00" },
    { day: "Tuesday",   open: "05:00", close: "22:00" },
    { day: "Wednesday", open: "05:00", close: "22:00" },
    { day: "Thursday",  open: "05:00", close: "22:00" },
    { day: "Friday",    open: "05:00", close: "22:00" },
    { day: "Saturday",  open: "06:00", close: "20:00" }
  ],
  // Next competition (used by the countdown on Home & Events)
  nextEvent: { name: "Nairobi's Strongest 2026", date: "2026-12-05T08:00:00+03:00" }
};
