import { DOMOutputSpec } from 'prosemirror-model';
import { NodeSpecs } from './models';
import { tableNodes } from 'prosemirror-tables';
import OrderedMap from 'orderedmap';
import { addListNodes } from 'prosemirror-schema-list';

const pDOM: DOMOutputSpec = ['p', { class: 'ng-prosemirror-paragraph' }, 0];
const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
const hrDOM: DOMOutputSpec = ['hr'];
const preDOM: DOMOutputSpec = ['pre', ['code', 0]];
const brDOM: DOMOutputSpec = ['br'];

const doc: NodeSpecs = {
  doc: {
    content: 'block+',
  },
};

const paragraph: NodeSpecs = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    },
  },
};

const paragraphWithList = addListNodes(
  OrderedMap.from(paragraph),
  'block*',
  'block',
);

const blockquote: NodeSpecs = {
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM;
    },
  },
};

const horizontal_rule: NodeSpecs = {
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
};

const heading: NodeSpecs = {
  heading: {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM(node) {
      return ['h' + node.attrs['level'], 0];
    },
  },
};

const code_block: NodeSpecs = {
  code_block: {
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM;
    },
  },
};

const text: NodeSpecs = {
  text: {
    group: 'inline',
  },
};

const image: NodeSpecs = {
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(node) {
          const dom = node as HTMLElement;
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
          };
        },
      },
    ],
    toDOM(node) {
      const { src, alt, title } = node.attrs;
      return ['img', { src, alt, title }];
    },
  },
};

const hard_break: NodeSpecs = {
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM;
    },
  },
};

const tables: NodeSpecs = {
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom) {
          return dom.style.backgroundColor || null;
        },
        setDOMAttr(value, attrs) {
          if (value)
            attrs['style'] =
              (attrs['style'] || '') + `background-color: ${value};`;
        },
      },
    },
  }),
};

export const BASE_NODES = {
  DOC: doc,
  PARAGRAPH: paragraph,
  PARAGRAPH_WITH_LIST: paragraphWithList,
  BLOCKQUOTE: blockquote,
  HORIZONTAL_RULE: horizontal_rule,
  HEADING: heading,
  CODE_BLOCK: code_block,
  TEXT: text,
  IMAGE: image,
  HARD_BREAK: hard_break,
  TABLES: tables,
};
