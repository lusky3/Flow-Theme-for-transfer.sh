// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('flow-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('flow-theme', newTheme);
}

// GitHub API Integration
async function fetchGitHubData() {
  try {
    const response = await fetch('https://api.github.com/repos/lusky3/transfer.sh-web');
    const data = await response.json();
    
    // Update stars
    const starsElement = document.getElementById('github-stars');
    if (starsElement && data.stargazers_count !== undefined) {
      starsElement.textContent = data.stargazers_count.toLocaleString();
    }
    
    // Fetch latest release
    const releaseResponse = await fetch('https://api.github.com/repos/lusky3/transfer.sh-web/releases/latest');
    const releaseData = await releaseResponse.json();
    
    const versionElement = document.getElementById('latest-version');
    if (versionElement && releaseData.tag_name) {
      versionElement.textContent = releaseData.tag_name;
    }
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error);
    const starsElement = document.getElementById('github-stars');
    const versionElement = document.getElementById('latest-version');
    
    if (starsElement) starsElement.textContent = '⭐';
    if (versionElement) versionElement.textContent = 'Latest';
  }
}

// Copy to Clipboard
function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const codeId = button.getAttribute('data-copy');
      const codeElement = document.getElementById(`${codeId}-code`);
      
      if (codeElement) {
        try {
          await navigator.clipboard.writeText(codeElement.textContent);
          
          // Visual feedback
          const originalHTML = button.innerHTML;
          button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          button.style.color = '#10b981';
          
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = '';
          }, 2000);
        } catch (error) {
          console.error('Failed to copy:', error);
        }
      }
    });
  });
}

// Smooth Scrolling
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Intersection Observer for Animations
function setupAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  document.querySelectorAll('.feature-card, .tech-item, .download-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// Lightbox for Screenshots
function setupLightbox() {
  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-nav prev" aria-label="Previous image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <img src="" alt="">
      <button class="lightbox-nav next" aria-label="Next image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  // Get all screenshot images
  const screenshots = Array.from(document.querySelectorAll('.screenshot-frame img'));
  let currentIndex = 0;

  // Open lightbox
  screenshots.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigation
  function showImage(index) {
    const img = screenshots[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
  }

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
    showImage(currentIndex);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % screenshots.length;
    showImage(currentIndex);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
      showImage(currentIndex);
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % screenshots.length;
      showImage(currentIndex);
    }
  });
}

// Handle Screenshot Loading
function setupScreenshots() {
  const lightImage = document.getElementById('demo-image-light');
  const darkImage = document.getElementById('demo-image-dark');
  
  // Create placeholder if images don't exist
  if (lightImage && !lightImage.complete) {
    lightImage.addEventListener('error', () => {
      createPlaceholder(lightImage, 'light');
    });
  }
  
  if (darkImage && !darkImage.complete) {
    darkImage.addEventListener('error', () => {
      createPlaceholder(darkImage, 'dark');
    });
  }
}

function createPlaceholder(img, theme) {
  const placeholder = document.createElement('div');
  placeholder.style.cssText = `
    width: 100%;
    aspect-ratio: 16/9;
    background: ${theme === 'dark' ? '#1e293b' : '#f1f5f9'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
    font-size: 1.5rem;
    font-weight: 600;
  `;
  placeholder.textContent = 'TransferFlow Preview';
  placeholder.className = img.className;
  
  img.parentNode.replaceChild(placeholder, img);
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchGitHubData();
  setupCopyButtons();
  setupSmoothScroll();
  setupAnimations();
  setupScreenshots();
  setupLightbox();
  
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('flow-theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
});

// Add loading state
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
