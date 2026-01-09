# Flow - GitHub Pages Guide

Complete guide for customizing, testing, and deploying the Flow showcase site.

## 🎨 Design System

### Color Palette

**Light Mode:**

- Primary: `#3b82f6` (Blue) | Background: `#ffffff` | Text: `#111827`

**Dark Mode:**

- Primary: `#60a5fa` (Light Blue) | Background: `#0f172a` | Text: `#f1f5f9`

### Typography

- Font: Inter (Google Fonts)
- Responsive breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

## 🔧 Customization

### Update Colors

Edit `styles.css`:

```css
:root {
  --color-primary: #3b82f6;
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}
```

### Update Content

Edit `index.html`:

- Hero section (title, description, badges)
- Features grid (6 cards with icons)
- Tech stack items
- Download section (Docker commands, links)

### GitHub Integration

Auto-fetches from:

```javascript
https://api.github.com/repos/lusky3/transfer.sh-web
https://api.github.com/repos/lusky3/transfer.sh-web/releases/latest
```

## 🧪 Testing

```bash
cd docs && npm install
npm test              # Run 10 tests (theme, API, accessibility)
node validate.js      # 15 quality checks (SEO, performance, links)
```

## 📸 Screenshots

```bash
npm run build         # Build application first
npm run screenshots   # Generate light/dark mode screenshots
```

Creates `docs/screenshot-{light,dark}.png` for the demo section.

## 🚢 Deployment

### Automatic (Recommended)

Push to `main` branch → GitHub Actions builds and deploys automatically

### Manual

```bash
npm run build && npm run screenshots
git add docs/ && git commit -m "Update site" && git push
```

### Configuration

**Settings** → **Pages** → Source: **GitHub Actions**

## 🔍 Troubleshooting

| Issue | Solution |
| ------- | ---------- |
| 404 error | Wait 5-10 min after first deploy, verify Pages enabled |
| Changes not showing | Clear cache (Ctrl+Shift+R), check Actions completed |
| Workflow fails | Check Actions tab, verify `dist/` builds locally |
| Screenshots missing | Run `npm run screenshots` and commit |

## ♿ Accessibility

WCAG 2.1 AA compliant:

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratios meet standards
- Focus indicators visible

Test with: axe DevTools, WAVE, Lighthouse

## 📊 Performance

- First Contentful Paint: <1s
- Time to Interactive: <2s
- Lighthouse Score: 95+
- Bundle Size: ~3KB JS (gzipped)

Optimizations: Minimal JS, CSS Grid/Custom Properties, Intersection Observer animations

## 🌐 Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari 14+, Chrome Mobile 90+

Required: CSS Grid, Custom Properties, Intersection Observer, Fetch API, LocalStorage

## 🤝 Contributing

1. Edit files in `docs/`
2. Test locally: `python3 -m http.server 8000`
3. Validate: `npm run validate:pages`
4. Submit PR

Guidelines: Maintain accessibility, keep JS minimal, test multiple browsers, optimize images

---

**Live**: <https://lusky3.github.io/transfer.sh-web/> | **License**: MIT
