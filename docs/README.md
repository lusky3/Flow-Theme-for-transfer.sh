# Flow - GitHub Pages Site

Modern showcase site for transfer.sh-web with dark/light themes, interactive demo, and real-time GitHub stats.

## 🚀 Quick Start

### Deploy to GitHub Pages

1. **Settings** → **Pages** → Source: **GitHub Actions**
2. Push to main branch
3. Visit: <https://lusky3.github.io/transfer.sh-web/>

### View Locally

```bash
cd docs
python3 -m http.server 8000  # Visit http://localhost:8000
```

## 📚 Documentation

- **[FLOW_THEME.md](FLOW_THEME.md)** - Design system and brand identity
- **[GITHUB_PAGES.md](GITHUB_PAGES.md)** - Complete customization guide

## 🎨 Customization

### Update Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --color-primary: #3b82f6;
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}
```

### Update Content

Edit `index.html` sections: hero, features, tech stack, download links

### Generate Screenshots

```bash
npm run build && npm run screenshots
```

## 🧪 Testing & Validation

```bash
cd docs && npm install
npm test              # Run test suite (10/10 passing)
node validate.js      # Validate site quality (15 checks)
```

## 🔧 Troubleshooting

**Site shows 404**: Wait 5-10 minutes after first deployment, clear cache  
**Changes not appearing**: Clear cache (Ctrl+Shift+R), verify workflow completed  
**Workflow fails**: Check Actions tab, ensure `dist/` builds locally

## 📊 Features

- Dark/light/system theme modes with smooth transitions
- Real-time GitHub stats (stars, latest version)
- Interactive browser mockup demo
- WCAG 2.1 AA accessible, Lighthouse 95+
- Responsive design, <1s first paint, ~3KB JS

---

**Live**: <https://lusky3.github.io/transfer.sh-web/> | **License**: MIT
