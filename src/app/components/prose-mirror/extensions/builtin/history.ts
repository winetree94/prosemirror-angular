import { history, redo, undo } from 'prosemirror-history';
import { PMPluginsFactory } from '../extension';
import { keymap } from 'prosemirror-keymap';

export const History = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {},
    plugins: () => [
      history(),
      keymap({
        'Mod-z': undo,
        'Shift-Mod-z': redo,
      }),
    ],
  };
};
