import { NodeSpec } from 'prosemirror-model';
import {
  columnResizing,
  goToNextCell,
  tableEditing,
  tableNodes,
} from 'prosemirror-tables';
import { PMPluginsFactory } from '../extension';
import { keymap } from 'prosemirror-keymap';

const tables: Record<string, NodeSpec> = {
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom) {
          return dom.style.backgroundColor || null;
        },
        setDOMAttr(value, attrs) {
          if (value)
            attrs['style'] =
              (attrs['style'] || '') + `background-color: ${value};`;
        },
      },
    },
  }),
};

export const Table = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...tables,
    },
    marks: {},
    plugins: () => [
      columnResizing(),
      tableEditing(),
      keymap({
        Tab: goToNextCell(1),
        'Shift-Tab': goToNextCell(-1),
      }),
    ],
  };
};
