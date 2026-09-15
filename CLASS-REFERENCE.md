# 🎯 Selector Reference for Webflow Developers

This document lists ALL selectors that have JavaScript animations attached — `data-anim-attr` attributes, remaining CSS classes, and IDs.
**⚠️ DO NOT rename or remove these without coordinating with the JS developer.**

> **Migration note (July 2026):** most animation hooks have moved from CSS classes to a custom attribute:
>
> ```html
> <div data-anim-attr="VALUE"></div>
> ```
>
> Add the attribute in Webflow via Element Settings → Custom Attributes (`data-anim-attr` / value below). Elements listed under "Class Hooks (Not Yet Migrated)" still use classes — those class names must not change.

---

## 🔴 Critical Structure (Breaking if Changed)

### Page Structure
| Selector | Type | Purpose | Used In |
|----------|------|---------|---------|
| `#smooth-wrapper` | ID | ScrollSmoother wrapper | All pages |
| `#smooth-content` | ID | ScrollSmoother content | All pages |
| `.page-wrapper` | class | Main page wrapper (cursor, video fullscreen) | All pages |
| `.main-wrapper` | class | Content wrapper (hero fade-in) | All pages |

### Barba.js Attributes
Every page MUST have these on the main content container:

```html
<div data-barba="container" data-barba-namespace="PAGE_NAME">
  <!-- Page content -->
</div>
```

| Page | Namespace Value |
|------|-----------------|
| Home | `home` |
| About | `about` |
| Portfolio | `portfolio` |
| Contact | `contact` |
| Case Study | `case-study` |
| Service | `service` |
| Thank You | `thanks` |
| Blog Listing | `blogs` |
| Blog Post | `blog` |
| Merch Product | `merch` |
| Checkout | `checkout` |

---

## 🟢 `data-anim-attr` Hooks (Migrated)

### Global — Any Page
| Value | Animation |
|-------|-----------|
| `animated-chars` | Staggered character reveal |
| `animated-words` | Staggered word reveal |
| `animated-lines` | Line-by-line reveal |
| `parallax-image` | Smooth parallax scrolling |
| `scroll_text-wrapper` | Horizontal scrolling text |
| `brandemic_svg-path` | SVG path draw animation |
| `is-fill` / `is-fill-rect` | Button fill hover effect |
| `button__flair` | Fill effect element inside button |
| `accordions` / `accordion` | Accordion container / item |
| `accordion_toggle` / `accordion_panel` | Accordion toggle button / expandable panel |
| `think-limitless` | Footer "Think Limitless" text |
| `footer_ai` | Footer AI elements |

### Heroes
| Value | Purpose | Page |
|-------|---------|------|
| `section-hero` | Hero section container | Service |
| `hero-tl-0` / `hero-tl-1` / `hero-tl-2` | Tag / headline / paragraph | Service |
| `hero_anim-chars` | Hero headline animation | Home |
| `hero-timeline-1` / `hero-timeline-2` / `hero-timeline-3` | Headline / paragraph / image | About, Portfolio, Blogs (`hero-timeline-1` also used for the product title on Merch) |
| `related_blog-item` | Related blog cards | Blog Post |
| `merch_media` | Product media wrapper — 1st child is the main image, later children's children are thumbnails | Merch |
| `merch_info` | Product info column — direct children stagger in (the child holding the title is skipped) | Merch |
| `section_contact-hero` | Hero section container | Contact |
| `contact_hero-tl-1` / `contact_hero-tl-2` / `contact_hero-tl-3` | Headline / paragraph / form-CTA | Contact |
| `is-one` … `is-six` | Floating hero images | Service, Contact |
| `scroll-down` | Scroll indicator | Service, Contact |

### Home Page
| Value | Purpose |
|-------|---------|
| `services-element` | Service card (hover expand) |
| `service_line` / `service_heading` / `service_number` | Animated line / title / number |
| `service_description` / `service_image` | Description reveal / floating image |
| `section_our-vision` | Vision section container — ⚠️ must ALSO keep the `.section_our-vision` class (JS destroy still queries the class) |
| `vision_para` | Vision paragraph (line split) |
| `our-vision_content-wrapper` / `our-vision_image` | Content wrapper / floating images |
| `cta_text-wrapper` / `cta_paragraph` | CTA container / text |
| `cta_span-image-one` / `cta_span-image-two` | Inline CTA images |

### About Page
| Value | Purpose |
|-------|---------|
| `milestone_block` / `milestone_line` / `milestone_number` | Milestone container / line / number |
| `para` | Milestone paragraph |
| `section_process-desktop` | Process section (desktop pin) |
| `process_heading` / `process_description` / `process_image` | Process step elements |
| `brand_logo` | Brand logos ticker |
| `team_ticker-wrapper-one` / `team_ticker-wrapper-two` | Team row 1 / row 2 (reversed) |
| `team_ticker_wrapper_collection-one` / `team_ticker_wrapper_collection-two` | Team ticker collection wrappers |
| `team_card` | Individual team card |
| `culture_image` | Culture images ticker |

### Service Page
| Value | Purpose |
|-------|---------|
| `section-service-process` | Horizontal scroll section |
| `service_process-contents` | Scrolling content |

### Case Study Pages
| Value | Purpose |
|-------|---------|
| `case_studies-ticker-element` / `case_study-ticker-image` | Case study ticker / images |
| `is-livx-texts` / `livx_ticker-text` | LivX ticker container / text |
| `hopscotch_ticker-one` / `hopscotch_ticker-two` / `hopscotch_ticker-svg` | Hopscotch tickers |
| `habitus_svg` + `is-line` / `is-primary` | Habitus SVG draw animation |
| `is-animating-screworks-svg` | Screworks rotating SVG |
| `rotate-group` | Flout rotating SVG group |
| `marquee_text-svg` | Skai marquee SVG |
| `blitz-text-svg` | Blitz marquee SVG |
| `gygl-marquee-svg` | GYGL marquee SVG |

---

## 🛒 `data-merch` Hooks (Product Page & Checkout)

Functional hooks for ordering — a separate attribute from `data-anim-attr`. Add via Element Settings → Custom Attributes (`data-merch` / value below).

### Merch Product Page (`merch`)
| Value | Element |
|-------|---------|
| `name` | Product title (text read for the order summary) |
| `price` | Selling price text, e.g. ₹1199 (display only — the real price comes from the CMS) |
| `image` | Main product image |
| `size` | Each size button. Size = its text, or `data-size` if set. Selected button gets `.is-active` |
| `size-error` | "Please select a size" message — set to display: none in Webflow |
| `qty-minus` / `qty-plus` | Quantity buttons (get `.is-disabled` at 1 / 10) |
| `qty-value` | Quantity number (text element or input) |
| `place-order` | Place Order button — goes to `/checkout` |

### Checkout Page (`checkout`)
| Value | Element |
|-------|---------|
| `checkout-content` | Wrapper around summary + form (hidden after payment / when no order) |
| `checkout-empty` | "No product selected" message — display: none in Webflow |
| `checkout-success` | Order-confirmed message — display: none in Webflow |
| `success-payment-id` | Text inside the success message showing the Razorpay payment ID |
| `checkout-form` | The Form Block (or the form inside it) |
| `checkout-error` | Error message text — display: none in Webflow |
| `summary-name` / `summary-size` / `summary-qty` | Order summary texts |
| `summary-price` / `summary-total` | Unit price / total |
| `summary-image` | Product image in the summary |
| `summary-link` | Optional "Edit" link back to the product |

**Checkout input Names** (Element Settings → Name, must match exactly):
`name`, `email`, `phone`, `address`, `city`, `state`, `pincode`

---

## 🟡 Class Hooks (Not Yet Migrated — DO NOT RENAME)

### Navigation
| Class | Purpose |
|-------|---------|
| `.hamburger_link` | Menu toggle button |
| `.hamburger` | Hamburger icon (gets `.is-active`) |
| `.mega_menu` / `.mega_menu-cta` / `.mega_menu-gradient` | Menu overlay / CTA / gradient |
| `.nav_link-wrapper` / `.nav_link` | Nav links container / link |
| `.nav_link-block` / `.nav_link-block-services` | Nav hover block / services dropdown |
| `.nav_arrow-icon` | Arrow icon in nav |
| `.sub_nav-wrapper` / `.sub_nav-link` | Sub-navigation container / links |

### Cursor
| Class | Purpose |
|-------|---------|
| `.inner-dot` | Custom cursor dot |
| `.link-hover-ix` | Elements that scale cursor |

### Video (Home)
| Class | Purpose |
|-------|---------|
| `.showreel` | Video element |
| `.custom-video-cursor` | Cursor styling |
| `.icon-play` / `.icon-close` | Play / close icons |

### Featured Work (Home, Service, Case Study)
| Class | Purpose |
|-------|---------|
| `.work_images-wrapper` / `.work_image` | Work gallery container / image |
| `.our-work_title` / `.our-work_title-wrapper` | Work section title / wrapper |

### Blog Post (TOC & Share)
| Class | Purpose |
|-------|---------|
| `.blog_content` / `.blog_content-wrapper` | Post content (headings scanned for TOC) |
| `.blog_toc-wrapper` / `.toc_lists` / `.toc_list-link` | TOC container / list / links |
| `.blog_side-info-wrapper` | Sticky sidebar |
| `.blog_share` | Share/copy-link button |

### Swipers
| Selector | Purpose |
|----------|---------|
| `.is-featured-swiper` + `.featured-next` / `.featured-prev` | Featured projects (Service) |
| `.is-testimonials` + `.testimonials-next` / `.testimonials-prev` | Testimonials |
| `.is-tools` | Tools swiper |
| `.is-process` + `#process-next` / `#process-prev` | Process swiper (mobile, About) |

### Portfolio
| Class | Purpose |
|-------|---------|
| `.filter` | Filter button (needs `id` matching category) |
| `.portfolio-item` / `.category` | Portfolio item / category text |

### Other
| Class | Purpose | Page |
|-------|---------|------|
| `.thank_hero-tl-1` / `-2` / `-3` | Hero headline / paragraph / element | Thank You |
| `.gallery_image` | Gallery images | Case Study |
| `.curved-text-svg` | Happy Feet curved text SVG | Case Study |
| `.arrow-1` / `.arrow-2` | Lottie scroll arrows | About, Contact, Service |
| `.services-wrapper.is-services-page` / `.section_services-offerings` / `.services_offering-heading` | Services offering pin | Service |
| `.service_button` | Button inside service card | Home |
| `.button` | Button inside vision wrapper | Home |
| `.case-preview_screen` / `.web_preview-link` | Live-site preview iframe | Case Study |
| `.copy_year` | Copyright year (auto-updated) | Footer, all pages |

---

## 🔵 ID Hooks

| ID | Purpose | Page |
|----|---------|------|
| `#heading_keywords` | Rotating words container | Home hero |
| `#greeting-text` | Rotating greeting text | Contact hero |
| `#videoCursor` | Custom video cursor | Home |
| `#wavePath` / `#textPath` | Happy Feet curved text SVG parts | Case Study |
| `#text-path` | GYGL text path animation | Case Study |
| `#process-next` / `#process-prev` | Process swiper nav | About (mobile) |
| `#wf-form-Contact-Form` | Contact form (reCAPTCHA + Worker submit) | Contact |

**Contact form field IDs** (read by JS on submit — must match exactly):
`full_name`, `email`, `contact_number`, `company`, `project_budget`, `project_deadline`, `your_message`, `how_did_you_hear`

---

## ⚙️ State Classes (Toggled by JS — style in Webflow, never repurpose)

| Class | Applied To / When |
|-------|-------------------|
| `.is-active` | `.hamburger` when menu open |
| `.no-scroll` | `<body>` when menu open |
| `.active` | Accordion toggles, portfolio filters, TOC links |
| `.close` | Accordion state |
| `.fullscreen-video` | `.page-wrapper` during video fullscreen |
| `.flex-layout` | Work images wrapper after Flip animation |
| `.is-copied` | Share button after copy |
| `.is-active` | Selected merch size button |
| `.is-disabled` | Merch quantity −/+ at the 1 / 10 limit |
| `.link-hover-ix` | Added to `.blog_share` for cursor interaction |
