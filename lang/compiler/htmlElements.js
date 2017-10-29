/**
 * List of all HTML elements.
 * Thanks mozilla 🙏 (https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
 */


const roots = [
  'html',
  'body'
]

const contentSectioning = [
  'address',
  'article',
  'aside',
  'footer',
  'h1,',
  'h2,',
  'h3,',
  'h4,',
  'h5,',
  'h6,',
  'header',
  'hgroup',
  'nav',
  'section'
]

const textContent = [
  'blockquote',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'hr',
  'li',
  'main',
  'ol',
  'p',
  'pre',
  'ul'
]

const inlineTextSemantics = [
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr'
]

const media = [
  'area',
  'audio',
  'img',
  'map',
  'track',
  'video'
]

const embeddedContent = [
  'embed',
  'object',
  'param',
  'source'
]

const scripting = [
  'canvas',
  'noscript',
  'script'
]

const demarcatingEdits = [
  'del',
  'ins'
]

const tableContent = [
  'caption',
  'col',
  'colgroup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr'
]

const forms = [
  'button',
  'datalist',
  'fieldset',
  'form',
  'input',
  'label',
  'legend',
  'meter',
  'optgroup',
  'option',
  'output',
  'progress',
  'select',
  'textarea'
]

const interactiveElements = [
  'details',
  'dialog',
  'menu',
  'menuitem',
  'summary'
]

const webComponents = [
  'content',
  'element',
  'shadow',
  'slot',
  'template'
]

// could report on deprecated elements, & suggest alternatives
const obsoleteElements = [
  'acronym',
  'applet',
  'basefont',
  'big',
  'blink',
  'center',
  'command',
  'content',
  'dir',
  'element',
  'font',
  'frame',
  'frameset',
  'image',
  'isindex',
  'keygen',
  'listing',
  'marquee',
  'multicol',
  'nextid',
  'noembed',
  'plaintext',
  'shadow',
  'spacer'
]

module.exports = [
  ...roots,
  ...contentSectioning,
  ...textContent,
  ...inlineTextSemantics,
  ...media,
  ...embeddedContent,
  ...scripting,
  ...demarcatingEdits,
  ...tableContent,
  ...forms,
  ...interactiveElements,
  ...obsoleteElements
]