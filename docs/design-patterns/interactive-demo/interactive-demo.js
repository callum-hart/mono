const parseCSS = (figure) => {
  let res = '';
  const nameSpace = `#${figure.getAttribute('id')}`;

  figure.querySelectorAll('[data-lang="CSS"] code').forEach(block => {
    let css = block.innerText;

    css.match(/([a-zA-Z]|@)(.*?){/g)
      .filter(match => !match.startsWith('@'))
      .forEach(selector => css = css.replace(selector, `${nameSpace} ${selector}`));

    res += css;
  });

  return res;
}

const setCSS = (styleTag, figure) => {
  styleTag.innerHTML = parseCSS(figure);
}

const render = (figure) => {
  const out = figure.querySelector('.figure__out');
  const html = figure.querySelector('[data-lang="HTML"]');
  const styleTag = document.createElement('style');

  // insert HTML and style tag

  out.innerHTML = html.innerText;
  out.appendChild(styleTag);
  setCSS(styleTag, figure);

  // make CSS declarations sortable

  new Sortable(figure.querySelector('[data-lang="CSS"]'), {
    onUpdate: (evt) => setCSS(styleTag, figure),
  });
}

const init = (() => {
  document.querySelectorAll("[id^='figure-']").forEach(figure => render(figure));
})();