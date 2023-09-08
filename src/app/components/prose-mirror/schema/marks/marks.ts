import { DOMOutputSpec } from 'prosemirror-model';
import { MarkSpecs } from './models';

const emDOM: DOMOutputSpec = ['em', 0];
const strongDOM: DOMOutputSpec = ['strong', 0];
const codeDOM: DOMOutputSpec = ['code', 0];

/// [Specs](#model.MarkSpec) for the marks in the schema.
export const BASIC_MARK_SPECS: MarkSpecs = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(node) {
          const dom = node as HTMLElement;
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
          };
        },
      },
    ],
    toDOM(node) {
      const { href, title } = node.attrs;
      return ['a', { href, title }, 0];
    },
  },

  /// An emphasis mark. Rendered as an `<em>` element. Has parse rules
  /// that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' },
    ],
    toDOM() {
      return emDOM;
    },
  },

  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {
        tag: 'b',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          return dom.style.fontWeight != 'normal' && null;
        },
      },
      { style: 'font-weight=400', clearMark: (m) => m.type.name == 'strong' },
      {
        style: 'font-weight',
        getAttrs: (node) => {
          const value = node as string;
          return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
        },
      },
    ],
    toDOM() {
      return strongDOM;
    },
  },

  /// Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    },
  },
};
