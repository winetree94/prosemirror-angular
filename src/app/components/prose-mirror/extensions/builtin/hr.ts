import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'src/app/components/prose-mirror/extensions/state';

const hrDOM: DOMOutputSpec = ['hr'];
const horizontal_rule: Record<string, NodeSpec> = {
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
};

export const Separator = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...horizontal_rule,
    },
    marks: {},
    plugins: () => [],
  };
};
