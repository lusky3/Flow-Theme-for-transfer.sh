#!/usr/bin/env node

/**
 * Validation script for GitHub Pages site
 * Checks HTML structure, accessibility, and performance
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const errors = [];
const warnings = [];

function validate() {
  console.log('🔍 Validating GitHub Pages site...\n');

  // Read HTML file
  const htmlPath = join(__dirname, 'index.html');
  const html = readFileSync(htmlPath, 'utf-8');

  // Check meta tags
  validateMetaTags(html);

  // Check accessibility
  validateAccessibility(html);

  // Check performance
  validatePerformance(html);

  // Check SEO
  validateSEO(html);

  // Check links
  validateLinks(html);

  // Report results
  console.log('\n📊 Validation Results:');
  console.log(`✅ Checks passed: ${getPassedChecks()}`);
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(w => console.log(`   - ${w}`));
  }

  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach(e => console.log(`   - ${e}`));
    process.exit(1);
  }

  console.log('\n✨ All validations passed!');
}

function validateMetaTags(html) {
  console.log('Checking meta tags...');
  
  if (!html.includes('<meta charset="UTF-8">')) {
    errors.push('Missing charset meta tag');
  }
  
  if (!html.includes('name="viewport"')) {
    errors.push('Missing viewport meta tag');
  }
  
  if (!html.includes('name="description"')) {
    warnings.push('Missing description meta tag');
  }
  
  if (!html.includes('<title>')) {
    errors.push('Missing title tag');
  }
}

function validateAccessibility(html) {
  console.log('Checking accessibility...');
  
  if (!html.includes('lang="en"')) {
    errors.push('Missing lang attribute on html tag');
  }
  
  if (!html.includes('aria-label')) {
    warnings.push('No ARIA labels found - consider adding for better accessibility');
  }
  
  // Check for alt text on images
  const imgMatches = html.match(/<img[^>]*>/g) || [];
  imgMatches.forEach(img => {
    if (!img.includes('alt=')) {
      warnings.push('Image missing alt attribute');
    }
  });
  
  // Check for semantic HTML
  const semanticTags = ['nav', 'main', 'section', 'article', 'header', 'footer'];
  semanticTags.forEach(tag => {
    if (!html.includes(`<${tag}`)) {
      warnings.push(`Consider using semantic <${tag}> element`);
    }
  });
}

function validatePerformance(html) {
  console.log('Checking performance...');
  
  // Check for preconnect
  if (html.includes('fonts.googleapis.com') && !html.includes('rel="preconnect"')) {
    warnings.push('Consider adding preconnect for Google Fonts');
  }
  
  // Check for inline critical CSS
  if (!html.includes('<style>') && html.includes('stylesheet')) {
    warnings.push('Consider inlining critical CSS for better performance');
  }
  
  // Check script loading
  const scriptMatches = html.match(/<script[^>]*>/gi) || [];
  scriptMatches.forEach(script => {
    if (!script.includes('defer') && !script.includes('async') && !script.includes('type="module"')) {
      warnings.push('Script without defer/async may block rendering');
    }
  });
}

function validateSEO(html) {
  console.log('Checking SEO...');
  
  const h1Count = (html.match(/<h1[^>]*>/g) || []).length;
  if (h1Count === 0) {
    errors.push('Missing H1 heading');
  } else if (h1Count > 1) {
    warnings.push('Multiple H1 headings found - consider using only one');
  }
  
  // Check heading hierarchy
  const headings = html.match(/<h[1-6][^>]*>/g) || [];
  if (headings.length === 0) {
    warnings.push('No heading structure found');
  }
}

function validateLinks(html) {
  console.log('Checking links...');
  
  // Check external links have proper attributes
  const externalLinks = html.match(/<a[^>]*href="https?:\/\/[^"]*"[^>]*>/g) || [];
  externalLinks.forEach(link => {
    if (!link.includes('rel="noopener"') && link.includes('target="_blank"')) {
      warnings.push('External link with target="_blank" missing rel="noopener"');
    }
  });
  
  // Check for broken anchor links
  const anchorLinks = html.match(/href="#([^"]*)"/g) || [];
  anchorLinks.forEach(link => {
    const id = link.match(/href="#([^"]*)"/)[1];
    if (id && !html.includes(`id="${id}"`)) {
      errors.push(`Broken anchor link: #${id}`);
    }
  });
}

function getPassedChecks() {
  const totalChecks = 20; // Approximate number of checks
  return totalChecks - errors.length - warnings.length;
}

// Run validation
try {
  validate();
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
