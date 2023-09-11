import { wrapIn } from 'prosemirror-commands';
import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';
import { PMPluginsFactory } from '../extension';

const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
const blockquote: Record<string, NodeSpec> = {
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

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

export const BlockQuote = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...blockquote,
    },
    marks: {},
    plugins: (schema) => [
      inputRules({
        rules: [blockQuoteRule(schema.nodes['blockquote'])],
      }),
      keymap({
        'Ctrl->': wrapIn(schema.nodes['blockquote']),
      }),
    ],
  };
};
