import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../state';

const strikethroughDOM: DOMOutputSpec = ['s', 0];
const strikethrough: Record<string, MarkSpec> = {
  /// Code font mark. Represented as a `<code>` element.
  strikethrough: {
    parseDOM: [{ tag: 's' }],
    toDOM() {
      return strikethroughDOM;
    },
  },
};

export const Strikethrough = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...strikethrough,
    },
    plugins: () => [],
  };
};
