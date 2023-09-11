import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import { PMPluginsFactory } from '../state';
import { inputRules } from 'prosemirror-inputrules';
import {
  bulletListRule,
  orderedListRule,
} from 'src/app/components/prose-mirror/plugins/input-rules/basic-input-rules';

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
    return {
      nodes: {
        ...(pluginConfig.addListNodes ? paragraphWithList : paragraph),
      },
      marks: {},
      plugins: (schema) => [
        inputRules({
          rules: [
            ...(pluginConfig.addListNodes
              ? [
                  orderedListRule(schema.nodes['ordered_list']),
                  bulletListRule(schema.nodes['bullet_list']),
                ]
              : []),
          ],
        }),
      ],
    };
  };
