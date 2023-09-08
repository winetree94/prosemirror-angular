import { Schema } from 'prosemirror-model';
import { BASIC_MARK_SPECS } from '../schema/marks/marks';
import { BASIC_NODE_SPECS } from '../schema/nodes/specs';

/// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const basicSchema = new Schema({
  nodes: BASIC_NODE_SPECS,
  marks: BASIC_MARK_SPECS,
});
