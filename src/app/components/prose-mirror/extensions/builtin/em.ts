import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../state';
import { emDash, inputRules } from 'prosemirror-inputrules';

const emDOM: DOMOutputSpec = ['em', 0];
const em: Record<string, MarkSpec> = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
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
};

export const EM = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...em,
    },
    plugins: () => [
      inputRules({
        rules: [emDash],
      }),
    ],
  };
};
