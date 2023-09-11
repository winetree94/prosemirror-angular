import { inputRules } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'src/app/components/prose-mirror/extensions/state';
import { headingRule } from 'src/app/components/prose-mirror/plugins/input-rules/basic-input-rules';

const heading: Record<string, NodeSpec> = {
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

export interface HeadingConfig {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = (config: HeadingConfig): PMPluginsFactory => {
  return () => {
    return {
      nodes: {
        ...heading,
      },
      marks: {},
      plugins: (schema) => [
        inputRules({
          rules: [headingRule(schema.nodes['heading'], config.level)],
        }),
      ],
    };
  };
};
