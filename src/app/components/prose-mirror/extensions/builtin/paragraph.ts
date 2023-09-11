import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { addListNodes, wrapInList } from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import { PMPluginsFactory } from '../state';
import { inputRules } from 'prosemirror-inputrules';
import {
  bulletListRule,
  orderedListRule,
} from 'src/app/components/prose-mirror/plugins/input-rules/basic-input-rules';
import { keymap } from 'prosemirror-keymap';

const pDOM: DOMOutputSpec = ['p', { class: '' }, 0];
const paragraph: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    },
  },
};

const paragraphWithList = addListNodes(
  OrderedMap.from(paragraph),
  'paragraph block*',
  'block',
).toObject();

export interface ParagraphPluginConfigs {
  addListNodes: boolean;
}

export const Paragraph =
  (pluginConfig: ParagraphPluginConfigs): PMPluginsFactory =>
  () => {
    const nodes = pluginConfig.addListNodes ? paragraphWithList : paragraph;

    return {
      nodes: nodes,
      marks: {},
      plugins: (schema) => {
        if (!pluginConfig.addListNodes) {
          return [];
        }
        return [
          inputRules({
            rules: [
              orderedListRule(schema.nodes['ordered_list']),
              bulletListRule(schema.nodes['bullet_list']),
            ],
          }),
          keymap({
            'Shift-Ctrl-8': wrapInList(schema.nodes['bullet_list']),
            'Shift-Ctrl-9': wrapInList(schema.nodes['ordered_list']),
          }),
        ];
      },
    };
  };
