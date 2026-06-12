class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.cachedResults = {};
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.isOpen = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.querySelector('form.header__search');
    if (form) {
      form.addEventListener('submit', this.onFormSubmit.bind(this));
    }

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 250).bind(this));

    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  onFormSubmit(event) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) {
      event.preventDefault();
    }
  }

  onFocus() {
    const searchTerm = this.getQuery();
    if (!searchTerm.length) return;

    if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    });
  }

  onKeyup(event) {
    if (!this.getQuery().length) {
      this.close();
    }
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');
    const allElements = Array.from(
      this.querySelectorAll('li.predictive-search__list-item, button.predictive-search__item--term')
    );
    const activeElementIndex = allElements.indexOf(selectedElement);

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;

    if (moveUp && selectedElementIndex !== -1) {
      selectedElementIndex = activeElementIndex === 0 ? allElements.length - 1 : activeElementIndex - 1;
    } else if (!moveUp) {
      selectedElementIndex = activeElementIndex === allElements.length - 1 ? 0 : activeElementIndex + 1;
    }

    const activeElement = allElements[selectedElementIndex];

    this.handleFocus(activeElement, selectedElement);
  }

  handleFocus(activeElement, selectedElement) {
    if (selectedElement) {
      selectedElement.setAttribute('aria-selected', false);
    }
    
    if (activeElement) {
      activeElement.setAttribute('aria-selected', true);
      const link = activeElement.querySelector('a') || activeElement;
      if (link) {
        link.focus();
      }
      this.input.setAttribute('aria-activedescendant', activeElement.id);
    }
  }

  selectOption() {
    const selectedElement = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');
    if (selectedElement) {
      selectedElement.click();
    }
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    fetch(`/search/suggest?q=${encodeURIComponent(searchTerm)}&resources[type]=product,page,article&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);
    this.open();
  }

  open() {
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }

  close() {
    this.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
    this.removeAttribute('aria-activedescendant');
    this.isOpen = false;
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);
