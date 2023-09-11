import { inputRules } from 'prosemirror-inputrules';
import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'src/app/components/prose-mirror/extensions/state';
import { blockQuoteRule } from 'src/app/components/prose-mirror/plugins/input-rules/basic-input-rules';

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
    ],
  };
};
