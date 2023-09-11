import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../state';
import { inputRules } from 'prosemirror-inputrules';
import { codeBlockRule } from 'src/app/components/prose-mirror/plugins/input-rules/basic-input-rules';

const preDOM: DOMOutputSpec = ['pre', ['code', 0]];
const code_block: Record<string, NodeSpec> = {
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

export const CodeBlock = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...code_block,
    },
    marks: {},
    plugins: (schema) => [
      inputRules({
        rules: [codeBlockRule(schema.nodes['code_block'])],
      }),
    ],
  };
};
