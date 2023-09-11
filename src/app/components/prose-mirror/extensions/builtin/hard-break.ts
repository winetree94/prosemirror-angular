import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../state';

const brDOM: DOMOutputSpec = ['br'];
const hard_break: Record<string, NodeSpec> = {
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

export const HardBreak = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...hard_break,
    },
    marks: {},
    plugins: () => [],
  };
};
