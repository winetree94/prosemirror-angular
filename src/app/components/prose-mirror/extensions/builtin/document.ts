import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from '../extension';

const doc: Record<string, NodeSpec> = {
  doc: {
    content: 'block+',
  },
};

export const Document = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...doc,
    },
    marks: {},
    plugins: () => [],
  };
};
