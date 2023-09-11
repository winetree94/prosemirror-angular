import { Plugin } from 'prosemirror-state';
import { PMPluginsFactory } from '../extension';

export const ResetOnEmpty = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {},
    plugins: () => [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          return newState.tr;
        },
      }),
    ],
  };
};
