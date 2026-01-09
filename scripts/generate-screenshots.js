#!/usr/bin/env node

/**
 * Screenshot Generator for TransferFlow GitHub Pages
 *
 * This script generates screenshots of the application in both light and dark modes
 * for use in the GitHub Pages site.
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { existsSync, createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Simple MIME type lookup
function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const mimeTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Simple static file server
function startServer(port = 8765) {
  return new Promise((resolve) => {
    // HTTP is acceptable here - this is a local-only temporary server
    // for screenshot generation, not exposed to any network
    const server = createServer((req, res) => {
      // Sanitize URL to prevent path traversal
      const requestPath = req.url === '/' ? 'index.html' : req.url;
      const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
      const filePath = join(rootDir, 'dist', normalizedPath);

      // Ensure the resolved path is within the dist directory
      if (!filePath.startsWith(join(rootDir, 'dist'))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => {
      console.log(`📡 Server started on http://localhost:${port}`);
      resolve(server);
    });
  });
}

console.log('🚀 Starting screenshot generation...');

// Check if dist exists
const distPath = join(rootDir, 'dist', 'index.html');
if (!existsSync(distPath)) {
  console.error('❌ dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

// Start local server
const server = await startServer();

const browser = await chromium.launch({
  headless: true,
});

try {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Retina display
  });

  const page = await context.newPage();

  // Load the demo application (with actual values instead of Go templates)
  await page.goto('http://localhost:8765/index.demo.html');
  await page.waitForLoadState('networkidle');

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Generate home page screenshots
  console.log('📸 Capturing home page - light mode...');
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'light';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.remove('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'light');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-light.png'),
    fullPage: false,
  });
  console.log('✅ Home page light mode saved');

  console.log('📸 Capturing home page - dark mode...');
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'dark';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.add('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-dark.png'),
    fullPage: false,
  });
  console.log('✅ Home page dark mode saved');

  // Generate full page screenshots
  console.log('📸 Capturing full page - light mode...');
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'light';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-full-light.png'),
    fullPage: true,
  });
  console.log('✅ Full page light mode saved');

  console.log('📸 Capturing full page - dark mode...');
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'dark';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-full-dark.png'),
    fullPage: true,
  });
  console.log('✅ Full page dark mode saved');

  // Generate mobile screenshots
  console.log('📸 Capturing mobile view - light mode...');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'light';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-mobile-light.png'),
    fullPage: false,
  });
  console.log('✅ Mobile light mode saved');

  console.log('📸 Capturing mobile view - dark mode...');
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'dark';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-mobile-dark.png'),
    fullPage: false,
  });
  console.log('✅ Mobile dark mode saved');

  // Generate preview page screenshots
  console.log('📸 Capturing preview pages...');

  // Reset to desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Image preview - light mode
  await page.goto('http://localhost:8765/download-image.demo.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'light';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.remove('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'light');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-preview-image-light.png'),
    fullPage: false,
  });
  console.log('✅ Image preview light mode saved');

  // Image preview - dark mode
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'dark';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.add('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-preview-image-dark.png'),
    fullPage: false,
  });
  console.log('✅ Image preview dark mode saved');

  // Code preview - light mode
  await page.goto('http://localhost:8765/download-code.demo.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'light';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.remove('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'light');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-preview-code-light.png'),
    fullPage: false,
  });
  console.log('✅ Code preview light mode saved');

  // Code preview - dark mode
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'dark';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.add('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-preview-code-dark.png'),
    fullPage: false,
  });
  console.log('✅ Code preview dark mode saved');

  // Markdown preview - light mode
  await page.goto('http://localhost:8765/download-markdown.demo.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'light';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.remove('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'light');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-preview-markdown-light.png'),
    fullPage: false,
  });
  console.log('✅ Markdown preview light mode saved');

  // Markdown preview - dark mode
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.documentElement.dataset.theme = 'dark';
    // eslint-disable-next-line no-undef
    document.documentElement.classList.add('dark');
    // eslint-disable-next-line no-undef
    localStorage.setItem('transfer-sh-theme', 'dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(rootDir, 'docs', 'screenshots', 'screenshot-preview-markdown-dark.png'),
    fullPage: false,
  });
  console.log('✅ Markdown preview dark mode saved');

  console.log('🎉 Screenshot generation complete! Generated 12 screenshots.');
} catch (error) {
  console.error('❌ Error generating screenshots:', error);
  process.exit(1);
} finally {
  await browser.close();
  server.close();
}
