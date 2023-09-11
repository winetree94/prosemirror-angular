import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../state';
import codemark from 'prosemirror-codemark';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

const codeDOM: DOMOutputSpec = ['code', 0];
const code: Record<string, MarkSpec> = {
  /// Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    },
  },
};

export const Code = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...code,
    },
    plugins: (schema) => [
      ...codemark({ markType: schema.marks['code'] }),
      keymap({
        'Mod-`': toggleMark(schema.marks['code']),
      }),
    ],
  };
};
