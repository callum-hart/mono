/* --------------------------------------
Handle theme
-------------------------------------- */

(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // map theme identifier to classname <paramName, className>
    const themeMap = {
      dark: 'theme--dark',
      blue: 'theme--blue'
    };

    if (urlParams.has('theme')) {
      const activeTheme = themeMap[urlParams.get('theme')];

      if (activeTheme) {
        const previousTheme = Object.values(themeMap).toString();
        const htmlClassList = document.querySelector('html').classList;

        htmlClassList.remove(previousTheme);
        htmlClassList.add(activeTheme);
      } else {
        console.log(`Theme "${urlParams.get('theme')}" doesn't exist, falling back to theme'less version`);
      }
    }
})();


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
  const contentOverlay = document.querySelector('.content-overlay');

  const toggleLeftShelf = (e) => {
    e.preventDefault();
    const action = leftShelf.classList.contains('left-shelf--open') ? 'CLOSE' : 'OPEN';

    switch (action) {
      case 'OPEN': {
        return openLeftShelf();
      }
      case 'CLOSE': {
        return closeLeftShelf();
      }
    }
  }

  const openLeftShelf = () => {
    leftShelf.classList.add('left-shelf--open');
    contentOverlay.classList.add('content-overlay--visible');
  }

  const closeLeftShelf = () => {
    leftShelf.classList.remove('left-shelf--open');
    contentOverlay.classList.remove('content-overlay--visible');
  }

  leftShelfToggle.addEventListener('click', toggleLeftShelf);
  contentOverlay.addEventListener('click', closeLeftShelf);

})();