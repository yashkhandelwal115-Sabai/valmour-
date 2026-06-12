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
  
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      menu.classList.toggle('is-open');
    });
  }
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
