import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../extension';

const doc: Record<string, NodeSpec> = {
  doc: {
    content: 'block+',
  },
};

const text: Record<string, NodeSpec> = {
  text: {
    group: 'inline',
  },
};

const pDOM: DOMOutputSpec = ['p', { class: '' }, 0];
const paragraph: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    },
  },
};

export const Document = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...doc,
      ...text,
      ...paragraph,
    },
    marks: {},
    plugins: () => [],
  };
};
