// Velour Base Scripts

document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initMobileNav();
  initSearchDrawer();
  initScrollReveal();
  initPredictiveSearch();
  initVariantSelectors();
  initWishlist();
});

document.addEventListener('shopify:section:load', function(event) {
  // Re-initialize scripts for the newly loaded section
  initStickyHeader();
  initMobileNav();
  initSearchDrawer();
  initScrollReveal();
  initPredictiveSearch();
  initVariantSelectors();
  initWishlist();
});

window.initWishlist = function() {
  var wishlist = JSON.parse(localStorage.getItem('velour_wishlist')) || [];
  
  document.querySelectorAll('.wishlist-btn').forEach(function(btn) {
    var handle = btn.getAttribute('data-product-handle');
    if (!handle) return;
    
    var outline = btn.querySelector('.wishlist-icon-outline');
    var filled = btn.querySelector('.wishlist-icon-filled');
    
    if (wishlist.includes(handle)) {
      if (outline) outline.style.display = 'none';
      if (filled) filled.style.display = 'inline-block';
    } else {
      if (outline) outline.style.display = 'inline-block';
      if (filled) filled.style.display = 'none';
    }
    
    if (!btn.dataset.wishlistInitialized) {
      btn.dataset.wishlistInitialized = 'true';
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var currentWishlist = JSON.parse(localStorage.getItem('velour_wishlist')) || [];
        var h = this.getAttribute('data-product-handle');
        
        var index = currentWishlist.indexOf(h);
        if (index > -1) {
          currentWishlist.splice(index, 1);
          this.querySelector('.wishlist-icon-outline').style.display = 'inline-block';
          this.querySelector('.wishlist-icon-filled').style.display = 'none';
          
          if (window.location.pathname.includes('wishlist')) {
             var card = this.closest('.filterable-product') || this.closest('.product-card').parentElement;
             if (card) card.style.display = 'none';
          }
        } else {
          currentWishlist.push(h);
          this.querySelector('.wishlist-icon-outline').style.display = 'none';
          this.querySelector('.wishlist-icon-filled').style.display = 'inline-block';
        }
        
        localStorage.setItem('velour_wishlist', JSON.stringify(currentWishlist));
      });
    }
  });
};

function initStickyHeader() {
  var header = document.querySelector('header');
  if (!header) return;
  
  // Set transparent to cream on scroll
  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run immediately on load in case page was scrolled on refresh
}

function initSearchDrawer() {
  var searchToggle = document.querySelector('[data-search-drawer-toggle]');
  var searchDrawer = document.getElementById('SearchDrawer');
  var overlay = document.querySelector('.search-drawer-overlay');
  var closeBtn = document.querySelector('.search-drawer__close');
  var input = searchDrawer ? searchDrawer.querySelector('input[type="search"]') : null;
  
  if (!searchDrawer) return;

  function openDrawer() {
    searchDrawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      if (input) input.focus();
    }, 120);
  }

  function closeDrawer() {
    searchDrawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-item, .reveal-stagger-child').forEach(function(item) {
      item.classList.add('reveal-item--visible');
    });
    return;
  }

  var revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-item--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal-item').forEach(function(el) {
    revealObserver.observe(el);
  });

  var staggerObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var container = entry.target;
        var children = container.querySelectorAll('.reveal-stagger-child');
        children.forEach(function(child, index) {
          setTimeout(function() {
            child.classList.add('reveal-item--visible');
          }, index * 120); // Luxury editorial stagger timing
        });
        observer.unobserve(container);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal-stagger-container').forEach(function(container) {
    staggerObserver.observe(container);
  });
}

function initMobileNav() {
  var toggle = document.querySelector('[data-mobile-nav-toggle]');
  var menu = document.querySelector('[data-mobile-nav]');
  var overlay = document.querySelector('.mobile-nav-overlay');
  var closeBtn = document.querySelector('.mobile-nav-close');
  
  if (!toggle || !menu) return;
  
  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }
  
  toggle.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

function initPredictiveSearch() {
  var searchInputs = document.querySelectorAll('input[type="search"]');
  var timeout = null;
  
  searchInputs.forEach(function(input) {
    input.addEventListener('input', function(e) {
      clearTimeout(timeout);
      var query = e.target.value;
      
      if (query.length < 3) return;
      
      timeout = setTimeout(function() {
        fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product,page,article')
          .then(function(response) { return response.json(); })
          .then(function(data) {
            // Render predictions
            console.log('Predictions:', data);
          });
      }, 300);
    });
  });
}

function initVariantSelectors() {
  var selectors = document.querySelectorAll('variant-selects select');
  selectors.forEach(function(select) {
    select.addEventListener('change', function() {
      // Logic to update URL and form input
    });
  });
}

function initHeroParallax() {
  const container = document.querySelector('[data-parallax-container]');
  if (!container) return;

  const layers = container.querySelectorAll('[data-parallax-speed]');
  
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  // Track mouse position
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    targetX = (e.clientX - centerX) / (rect.width / 2);
    targetY = (e.clientY - centerY) / (rect.height / 2);
  });

  // Smooth animation loop
  function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    layers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.05;
      const x = currentX * speed * 100;
      const y = currentY * speed * 100;
      
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(animate);
  }
  
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  }
}

function initMagneticButtons() {
  const magnets = document.querySelectorAll('[data-magnetic]');
  
  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', function(e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const rect = this.getBoundingClientRect();
      const h = rect.width / 2;
      
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - rect.height / 2;

      this.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
    });

    magnet.addEventListener('mouseleave', function() {
      this.style.transform = 'translate3d(0px, 0px, 0)';
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initHeroParallax();
  initMagneticButtons();
});
document.addEventListener('shopify:section:load', function(event) {
  if (event.detail.sectionId === 'hero-banner' || !event.detail.sectionId) {
    initHeroParallax();
    initMagneticButtons();
  }
});
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-item--visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('#MainContent > .shopify-section > div, #MainContent > .shopify-section > section');
  let delayIndex = 0;
  sections.forEach((section) => {
    if (!section.classList.contains('cinematic-hero') && !section.classList.contains('reveal-item')) {
      section.classList.add('reveal-item');
      // Stagger initial view sections
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
          section.style.transitionDelay = (delayIndex * 0.15) + 's';
          delayIndex++;
      }
    }
    observer.observe(section);
  });
}

document.addEventListener('DOMContentLoaded', initScrollReveal);
document.addEventListener('shopify:section:load', initScrollReveal);
function initStickyHeader() {
  const header = document.querySelector('.header--sticky');
  if (!header) return;

  const isTransparentOnHome = header.classList.contains('header--transparent');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
      if (isTransparentOnHome) header.classList.remove('header--transparent');
    } else {
      header.classList.remove('header--scrolled');
      if (isTransparentOnHome) header.classList.add('header--transparent');
    }
  }, { passive: true });
}

function initVelourPreloader() {
  const preloader = document.getElementById('velour-preloader');
  if (!preloader) return;

  if (sessionStorage.getItem('velour_preloader_played') === 'true') {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    document.body.classList.add('preloader-finished');
    return;
  }

  const counterEl = document.getElementById('preloader-counter');
  const images = document.querySelectorAll('.preloader-img');
  
  // Lock body scroll
  document.body.style.overflow = 'hidden';

  let progress = 0;
  let imgIndex = 0;
  const duration = 2500; // 2.5 seconds total loading time
  const fps = 30; // Update counter 30 times a second
  const stepTime = 1000 / fps;
  const totalSteps = duration / stepTime;
  const increment = 100 / totalSteps;

  const counterInterval = setInterval(() => {
    progress += increment;
    
    // Shuffle images
    if (Math.floor(progress) % 5 === 0 && images.length > 0) {
      images.forEach(img => {
        img.classList.remove('is-active');
        img.style.zIndex = '0';
      });
      
      imgIndex = (imgIndex + 1) % images.length;
      
      images[imgIndex].classList.add('is-active');
      images[imgIndex].style.zIndex = '1';
      
      // Random subtle rotation for dynamic feel
      const rot = (Math.random() * 15 - 7.5).toFixed(1);
      images[imgIndex].style.transform = `scale(1) rotate(${rot}deg)`;
    }

    if (progress >= 100) {
      progress = 100;
      clearInterval(counterInterval);
      
      // Finish sequence
      setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.style.overflow = ''; // Unlock scroll
        document.body.classList.add('preloader-finished');
        sessionStorage.setItem('velour_preloader_played', 'true');
      }, 300);
    }
    
    // Format to 000
    let displayNum = Math.floor(progress).toString();
    if (displayNum.length < 3 && progress < 100) {
      displayNum = '0'.repeat(3 - displayNum.length) + displayNum;
    }
    counterEl.textContent = displayNum;
    
  }, stepTime);
}

document.addEventListener('DOMContentLoaded', initVelourPreloader);

/* ============================================================================
   PREMIUM PRODUCT PAGE TRANSITION
============================================================================ */
class PremiumPageTransition {
  constructor() {
    this.links = document.querySelectorAll('.js-product-transition');
    if (!this.links.length) return;
    
    // Create overlay DOM dynamically
    this.createOverlay();
    this.bindEvents();
  }

  createOverlay() {
    // Only create if it doesn't exist
    if (document.querySelector('.luxury-transition-overlay')) {
      this.overlay = document.querySelector('.luxury-transition-overlay');
      this.circle = this.overlay.querySelector('.luxury-transition-overlay__circle');
      return;
    }

    this.overlay = document.createElement('div');
    this.overlay.className = 'luxury-transition-overlay';
    
    this.overlay.innerHTML = `
      <div class="luxury-transition-overlay__bg"></div>
      <div class="luxury-transition-overlay__circle"></div>
      <div class="luxury-transition-overlay__content">
        <h2 class="luxury-transition-overlay__logo">VELOUR</h2>
        <div class="luxury-transition-overlay__subtitle">Timeless Elegance</div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    this.circle = this.overlay.querySelector('.luxury-transition-overlay__circle');
  }

  bindEvents() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Only intercept normal left clicks without modifiers
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0) return;
        
        e.preventDefault();
        
        // Find the closest anchor tag in case the click was on a child element
        const anchor = e.target.closest('a');
        if (!anchor) return;

        this.startTransition(e.clientX, e.clientY, anchor.href);
      });
    });
  }

  startTransition(x, y, targetUrl) {
    // Calculate the distance to the furthest corner to ensure the circle covers the screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxDistX = Math.max(x, windowWidth - x);
    const maxDistY = Math.max(y, windowHeight - y);
    const radius = Math.sqrt(maxDistX * maxDistX + maxDistY * maxDistY);
    const diameter = radius * 2;

    // Set initial position and size of the circle
    this.circle.style.width = `${diameter}px`;
    this.circle.style.height = `${diameter}px`;
    this.circle.style.left = `${x - radius}px`;
    this.circle.style.top = `${y - radius}px`;
    this.circle.style.transform = 'scale(0)';
    
    // Force reflow
    this.circle.offsetHeight; 
    
    // Trigger animation
    this.overlay.classList.add('is-active');
    this.circle.style.transform = 'scale(1)';
    
    // Wait for the circle to cover the screen (0.8s based on CSS), then navigate
    setTimeout(() => {
      // Set the flag for the incoming page to catch
      sessionStorage.setItem('velour_transition_active', 'true');
      window.location.href = targetUrl;
    }, 800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PremiumPageTransition();
});
