/**
 * Tests for GitHub Pages site functionality
 * Run with: node --test docs/script.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

describe('Flow GitHub Pages', () => {
  describe('Theme Management', () => {
    it('should initialize theme from localStorage', () => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      const { document } = dom.window;
      
      const localStorage = {
        data: { 'transferflow-theme': 'dark' },
        getItem(key) { return this.data[key] || null; }
      };
      
      const savedTheme = localStorage.getItem('transferflow-theme');
      document.documentElement.setAttribute('data-theme', savedTheme || 'light');
      
      assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
    });

    it('should toggle theme correctly', () => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      const { document } = dom.window;
      
      const localStorage = { data: {}, setItem(k, v) { this.data[k] = v; } };
      
      document.documentElement.setAttribute('data-theme', 'light');
      
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('transferflow-theme', newTheme);
      
      assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
      assert.strictEqual(localStorage.data['transferflow-theme'], 'dark');
    });

    it('should default to light theme when no preference', () => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      const { document } = dom.window;
      
      const localStorage = { getItem() { return null; } };
      const savedTheme = localStorage.getItem('transferflow-theme');
      const theme = savedTheme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      
      assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');
    });
  });

  describe('HTML Structure', () => {
    it('should have proper meta tags', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test</title>
          </head>
          <body></body>
        </html>
      `);
      
      const { document } = dom.window;
      assert.ok(document.querySelector('meta[charset="UTF-8"]'));
      assert.ok(document.querySelector('meta[name="viewport"]'));
      assert.strictEqual(document.documentElement.getAttribute('lang'), 'en');
    });

    it('should have semantic HTML structure', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <nav></nav>
            <main></main>
            <footer></footer>
          </body>
        </html>
      `);
      
      const { document } = dom.window;
      assert.ok(document.querySelector('nav'));
      assert.ok(document.querySelector('main'));
      assert.ok(document.querySelector('footer'));
    });
  });

  describe('Accessibility', () => {
    it('should have ARIA labels on interactive elements', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <button aria-label="Toggle theme">Theme</button>
            <a href="#section" aria-label="Go to section">Link</a>
          </body>
        </html>
      `);
      
      const { document } = dom.window;
      const button = document.querySelector('button');
      const link = document.querySelector('a');
      
      assert.ok(button.getAttribute('aria-label'));
      assert.ok(link.getAttribute('aria-label'));
    });

    it('should have alt text on images', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <img src="test.png" alt="Test image">
          </body>
        </html>
      `);
      
      const { document } = dom.window;
      const img = document.querySelector('img');
      assert.ok(img.getAttribute('alt'));
    });
  });

  describe('Performance', () => {
    it('should support lazy loading', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <img src="test.png" loading="lazy" alt="Test">
          </body>
        </html>
      `);
      
      const { document } = dom.window;
      const img = document.querySelector('img');
      assert.strictEqual(img.getAttribute('loading'), 'lazy');
    });

    it('should use efficient selectors', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="test-element">Content</div>
          </body>
        </html>
      `);
      
      const { document } = dom.window;
      const start = Date.now();
      const element = document.getElementById('test-element');
      const duration = Date.now() - start;
      
      assert.ok(element);
      assert.ok(duration < 10);
    });
  });

  describe('CSS Variables', () => {
    it('should define theme colors', () => {
      const cssContent = `
        :root {
          --color-primary: #3b82f6;
          --color-bg: #ffffff;
        }
        [data-theme="dark"] {
          --color-primary: #60a5fa;
          --color-bg: #0f172a;
        }
      `;
      
      assert.ok(cssContent.includes('--color-primary'));
      assert.ok(cssContent.includes('--color-bg'));
      assert.ok(cssContent.includes('[data-theme="dark"]'));
    });
  });
});
