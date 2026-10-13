# Strongman Gym — Website

A complete, responsive website for **Strongman Gym**, a strongman, powerlifting and strength training gym in Nairobi. Plain HTML, CSS and JavaScript. No installation or build step needed.

## How to open it
1. On GitHub, click **Code → Download ZIP** (or `git clone`).
2. Extract the folder and double-click **`index.html`**. It opens in your browser. (The Google font and map need internet.)

## Pages & features
| Page | Features |
|------|----------|
| `index.html` | Hero, scrolling marquee, animated stats, programs, facilities, testimonials slider, competition countdown, pricing preview |
| `about.html` | Story, mission/vision/promise, core values, milestones timeline, amenities |
| `programs.html` | 6 programs (Strongman, Powerlifting, S&C, Women's, Youth, Competition Prep), personal-training packages, onboarding steps |
| `schedule.html` | Weekly class timetable with **program filter** |
| `membership.html` | Plans with **monthly/annual toggle** (20% annual saving), passes & discounts, comparison table, M-Pesa payment steps, FAQ |
| `coaches.html` | Coach profiles with PRs and credentials, careers section |
| `events.html` | Countdown, event calendar (register via WhatsApp), gym records hall of fame |
| `gallery.html` | Filterable gallery with lightbox (← → arrow keys / Esc) |
| `tools.html` | **One-rep max**, **barbell plate loader**, **BMI** and **calorie & protein** calculators |
| `contact.html` | **Free-trial booking form** (validates Kenyan phone numbers), contact form, live "open now" hours, Google Map, FAQ |
| `404.html` | Not-found page |

Also: mobile menu, WhatsApp chat button, back-to-top button, newsletter signup, scroll animations, accessibility (skip link, keyboard support, reduced-motion), print styles.

## Customising
- **Phone, WhatsApp, email, address, M-Pesa Paybill, social links, opening hours, next competition date:** edit `js/config.js`. Every page updates.
- **Colours:** edit the variables at the top of `css/style.css` (`--primary`, `--accent`).
- **Photos:** see `images/README.txt` (hero banner, gallery, coaches).
- **Content:** names, prices, records and testimonials are sample data. Replace them with your gym's real information.
- **Editing pages:** each page is a normal HTML file; edit it directly. The header and footer are repeated in every page, so a menu change must be made in all of them.

## Going live
Forms currently save submissions only in the visitor's browser (demo). To receive them by email, connect a form service such as **Formspree** or **Netlify Forms**. Host the folder for free on **GitHub Pages** (Settings → Pages → deploy from branch) or **Netlify**, or on any Kenyan web host.
