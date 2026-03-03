# Brandemic - Custom Animations

Custom GSAP and Barba.js animations for the Brandemic website.

> 📚 **For Webflow Developers:** See [WORKFLOW.md](WORKFLOW.md) and [CLASS-REFERENCE.md](CLASS-REFERENCE.md)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Watch for changes and rebuild automatically:

```bash
npm run dev
```

### Build for Production

Build the bundled file:

```bash
npm run build
```

This creates:
- `dist/main.js` - Full bundle with comments
- `dist/main.min.js` - Minified bundle for production

## 📝 Usage in Webflow

1. Build the project: `npm run build`
2. Host `dist/main.js` or `dist/main.min.js` on a CDN (GitHub Pages)
3. In Webflow, add the script tag in your site's custom code:

```html
<!-- Before </body> tag -->
<script src="https://your-cdn.com/main.min.js"></script>
```

**Important:** Make sure these CDN scripts are loaded BEFORE your custom script:
- GSAP core
- ScrollTrigger
- ScrollSmoother
- DrawSVGPlugin
- SplitText
- Draggable
- Flip
- Observer
- Barba.js
- Swiper

## 🔧 Making Changes

1. Edit the relevant file in `/src`
2. Run `npm run build` to generate the bundle
3. Commit and push to Git
4. Deploy the updated `dist/main.js` to your CDN

## 📌 Version Control Workflow

1. **Before making changes:** Pull latest from Git
2. **Make your edits** in the modular source files
3. **Test locally** if possible
4. **Build:** `npm run build`
5. **Commit:** Include both source changes and built files
6. **Push:** Deploy automatically via your CDN

## 🐛 Debugging

Each page's animations can be traced through its page module in `/src/pages/`. For example, to debug home page animations:

1. Open `src/pages/home.js`
2. See which animations are initialized
3. Navigate to the specific animation file to debug

## 📚 Dependencies (Loaded via CDN)

- GSAP (with Club plugins)
- Barba.js
- Swiper
- Webflow

These are NOT bundled and must be loaded before the main script.

---

## 👥 Team Quick Reference

### For Webflow Developers

1. **Before changing any element:** Check [CLASS-REFERENCE.md](CLASS-REFERENCE.md)
2. **Need new animation?** Create request using template in [WORKFLOW.md](WORKFLOW.md)
3. **Testing:** Always use staging URL (`@main`) before production

### For JS Developer

```bash
# Quick release commands
npm run release:patch   # Bug fixes: 1.0.0 → 1.0.1
npm run release:minor   # Features: 1.0.0 → 1.1.0
npm run release:major   # Breaking: 1.0.0 → 2.0.0
```

### jsDelivr URLs

```
# Production (pinned version)
https://cdn.jsdelivr.net/gh/brandemic-web/brandemic-web@v1.0.x/dist/main.min.js

# Staging (latest)
https://cdn.jsdelivr.net/gh/brandemic-web/brandemic-web@main/dist/main.js
```

