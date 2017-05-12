/* --------------------------------------
Initialise search input
-------------------------------------- */

(() => {
  const recentSearches = [
    'How to win CSS specificity wars?',
    'Remove cascade from CSS',
    'Remove specificity from CSS',
    'How to write better CSS?',
    'Make CSS more predictable',
    'Methodologies for managable CSS',
    'Strategies for scalable CSS',
    'Is !important my only ally?',
    'Do I really need to write CSS in JavaScript?',
    'Beginners guide to JavaScript'
  ];

  const navSearch = new CompleteMe("#nav-search-input--js", {
    data: recentSearches,
    placeholder: 'Search'
  });
})();

/* --------------------------------------
Handle nav state (search open / closed)
-------------------------------------- */

(() => {
  const nav = document.querySelector('.nav');
  const navInput = nav.querySelector('.cm-input');
  const openNavSearch = nav.querySelector('#open-nav-search--js');
  const closeNavSearch = nav.querySelector('#close-nav-search--js')

  const toggleNavSearch = (e) => {
    e.preventDefault();
    const action = e.target.dataset.action;

    switch (action) {
      case 'OPEN': {
        nav.classList.add('nav--search-open');
        return navInput.focus();
      }
      case 'CLOSE': {
        return nav.classList.remove('nav--search-open');
      }
    }
  }

  openNavSearch.addEventListener('click', toggleNavSearch);
  closeNavSearch.addEventListener('click', toggleNavSearch);
})();

/* --------------------------------------
Handle left shelf visibility
-------------------------------------- */

(() => {
  const leftShelf = document.querySelector('.left-shelf');
  const leftShelfToggle = document.querySelector('#toggle-left-shelf--js');

  const toggleLeftShelf = (e) => {
    e.preventDefault();
    const action = leftShelf.classList.contains('left-shelf--open') ? 'CLOSE' : 'OPEN';

    switch (action) {
      case 'OPEN': {
        return leftShelf.classList.add('left-shelf--open');
      }
      case 'CLOSE': {
        return leftShelf.classList.remove('left-shelf--open');
      }
    }
  }

  leftShelfToggle.addEventListener('click', toggleLeftShelf);
})();