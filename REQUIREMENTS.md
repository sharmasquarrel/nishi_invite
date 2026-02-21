# Project Requirements — Wedding Invitation

This document extracts all observable requirements, content, behaviors and implementation details from the repository files `index.html` and `script.js` (as of the user's provided attachments).

## High-level summary

- Title: "Anubhav & Nishi - Wedding Invitation"
- Single-page interactive invitation with 9 scenes/cards presented like a slideshow. Includes an opening overlay, floating decorative flowers, progress indicator, countdown timer, gallery lightbox, and keyboard/touch/click navigation.

## Files referenced

- `index.html` — page structure and content
- `script.js` — front-end behavior and interactions
- `styles.css` — visual design (not exhaustively listed here)
- `favicon.svg` — site favicon
- `images/` — image assets (one `image.png` present)

## Fonts / external resources

- Google Fonts: Cinzel, Cormorant Garamond, Great Vibes

## Scenes / Content (data extracted from HTML)

Total scenes: 9 (each .scene with `data-scene` 1..9)

1. Scene 1 — Header
   - Om symbol (ॐ), main title "Wedding Invitation", subtitle "Together with their families"

2. Scene 2 — Couple Names
   - Groom: Anubhav Sharma
   - Groom parent info: "S/O Late Avinash Kumar Sharma"
   - Bride: Nishi Trigunait
   - Bride parent info: "D/O Kamal Trigunait"
   - Wedding date display: "21st April 2026"

3. Scene 3 — Invitation Message
   - Title: "With Great Joy"
   - Message: request honor of presence at the wedding ceremony
   - Signature: "From the Groom's Family"

4. Scene 4 — Events Timeline
   - Event A: Shubh Tilak & Haldi Kalash — 19th April 2026 — 7:00 PM onwards — Ramnagri Sector - 2, Patna - 800025
   - Event B: Yagopavitra — 21st April 2026 — 11:00 AM — Ramnagri Sector - 2, Patna - 800025
   - Event C: Baraat Departure & Wedding Ceremony — 21st April 2026 — 6:00 PM — From Ramnagri Sector - 2, Patna - 800025

5. Scene 5 — Venue Details
   - Residence: Ramnagri Sector - 2, Patna - 800025 — map link: https://maps.app.goo.gl/reLAm9K88BJ5MSNr5
   - Wedding Venue: Sundar Vatika, Ramnagri Road, Patna - 800025 — map link: https://maps.app.goo.gl/jeNkRx4ZHhxbNjUU8

6. Scene 6 — Contact Information
   - Contact 1: Anubhav — tel: +91 7543028853
   - Contact 2: Mother — tel: +91 9386614852

7. Scene 7 — Photo Gallery (6 placeholder items)
   - Gallery items: six `.gallery-item` elements with placeholders (emoji placeholders in markup)

8. Scene 8 — Blessing
   - Title: "Divine Blessings"; message invoking Lord Ganesha

9. Scene 9 — Footer / Closing
   - Closing message: "We look forward to celebrating with you!"
   - Om footer and mantra: "ॐ शांति शांति शांति"
