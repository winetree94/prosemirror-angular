import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import {
  ellipsis,
  emDash,
  inputRules,
  smartQuotes,
} from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { menuBar } from 'prosemirror-menu';
import { Schema } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  blockQuoteRule,
  bulletListRule,
  codeBlockRule,
  headingRule,
  orderedListRule,
} from './plugins/input-rules/basic-input-rules';
import { buildBasicKeymap } from './plugins/keymaps/basic-keymaps';
import { buildMenuItems } from './plugins/menu-bar/basic-menu-items';
import { basicSchema } from './schema/basic';
import {
  columnResizing,
  fixTables,
  goToNextCell,
  tableEditing,
} from 'prosemirror-tables';

@Component({
  selector: 'ng-prose-mirror',
  templateUrl: './prose-mirror.component.html',
  styleUrls: ['./prose-mirror.component.scss'],
  standalone: true,
  imports: [],
})
export class ProseMirrorComponent implements OnInit {
  @ViewChild('editor', { static: true })
  private readonly editor!: ElementRef<HTMLDivElement>;

  @ViewChild('content', { static: true })
  private readonly content!: ElementRef<HTMLDivElement>;

  public view!: EditorView;

  public mySchema = new Schema({
    nodes: addListNodes(
      basicSchema.spec.nodes,
      'paragraph (ordered_list | bullet_list)*',
      'block',
    ),
    marks: basicSchema.spec.marks,
  });

  public ngOnInit() {
    let state = EditorState.create({
      schema: this.mySchema,
      plugins: [
        // table
        columnResizing(),
        tableEditing(),
        keymap({
          Tab: goToNextCell(1),
          'Shift-Tab': goToNextCell(-1),
        }),
        // input 입력 시 동작할 것들
        inputRules({
          rules: [
            ...smartQuotes,
            ellipsis,
            emDash,
            blockQuoteRule(this.mySchema.nodes['blockquote']),
            orderedListRule(this.mySchema.nodes['ordered_list']),
            bulletListRule(this.mySchema.nodes['bullet_list']),
            codeBlockRule(this.mySchema.nodes['code_block']),
            headingRule(this.mySchema.nodes['heading'], 6),
          ],
        }),
        // 키맵 설정
        keymap(buildBasicKeymap(this.mySchema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        menuBar({
          floating: false,
          content: buildMenuItems(this.mySchema).fullMenu,
        }),
        history(),
        new Plugin({
          props: {
            attributes: { class: 'ProseMirror-Root-Class' },
          },
        }),
      ],
    });

    const fix = fixTables(state);
    if (fix) state = state.apply(fix.setMeta('addToHistory', false));

    this.view = new EditorView(this.editor.nativeElement, {
      state: state,
    });

    document.execCommand('enableObjectResizing', false, 'false');
    document.execCommand('enableInlineTableEditing', false, 'false');
  }
}
