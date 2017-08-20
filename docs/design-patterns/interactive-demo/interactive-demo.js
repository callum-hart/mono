const getCSS = (figure) => {
  let css = '';

  figure.querySelectorAll('[data-lang="CSS"] code').forEach(declaration => {
    // todo: prefix selectors with figure ID to prevent styles from different
    // examples conflicting
    css += declaration.innerText;
  });

  return css;
}

const setCSS = (styleTag, css) => {
  styleTag.innerHTML = css;
}

const render = (figure) => {
  const out = figure.querySelector('.figure__out');
  const html = figure.querySelector('[data-lang="HTML"]');
  const styleTag = document.createElement('style');

  // insert HTML and CSS

  out.innerHTML = html.innerText;
  setCSS(styleTag, getCSS(figure));
  out.appendChild(styleTag);

  // make CSS declarations sortable

  new Sortable(figure.querySelector('[data-lang="CSS"]'), {
    onUpdate: (evt) => setCSS(styleTag, getCSS(figure)),
  });
}

const init = (() => {
  document.querySelectorAll("[id^='figure-']").forEach(figure => render(figure));

})();