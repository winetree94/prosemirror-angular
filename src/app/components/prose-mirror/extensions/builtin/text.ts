import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../extension';

const text: Record<string, NodeSpec> = {
  text: {
    group: 'inline',
  },
};

export const Text = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...text,
    },
    marks: {},
    plugins: () => [],
  };
};
