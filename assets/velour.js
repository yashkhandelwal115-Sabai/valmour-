// Velour Base Scripts

document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initMobileNav();
  initPredictiveSearch();
  initVariantSelectors();
});

document.addEventListener('shopify:section:load', function(event) {
  // Re-initialize scripts for the newly loaded section
  initStickyHeader();
  initMobileNav();
  initPredictiveSearch();
  initVariantSelectors();
});

function initStickyHeader() {
  var header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
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
