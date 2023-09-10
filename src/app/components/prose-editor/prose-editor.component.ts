import { Component, OnInit, ViewChild } from '@angular/core';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { ellipsis, inputRules, smartQuotes } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState, Plugin } from 'prosemirror-state';
import {
  blockQuoteRule,
  bulletListRule,
  codeBlockRule,
  headingRule,
  horizontalSeparatorRule,
  orderedListRule,
} from '../prose-mirror/plugins/input-rules/basic-input-rules';
import { buildBasicKeymap } from '../prose-mirror/plugins/keymaps/basic-keymaps';
import { basicSchema } from '../prose-mirror/schema/basic';
import {
  columnResizing,
  fixTables,
  goToNextCell,
  tableEditing,
} from 'prosemirror-tables';
import { ProseMirrorModule } from 'src/app/components/prose-mirror/prose-mirror.module';
import { ProseMirrorComponent } from 'src/app/components/prose-mirror/prose-mirror.component';
import { EditorProps } from 'prosemirror-view';
import { buildMenuItems } from 'src/app/components/prose-mirror/plugins/menu-bar/basic-menu-items';
import { menuBar } from 'src/app/components/prose-mirror/plugins/menu-bar/menubar';

@Component({
  selector: 'ng-prose-editor',
  templateUrl: './prose-editor.component.html',
  styleUrls: ['./prose-editor.component.scss'],
  standalone: true,
  imports: [ProseMirrorModule],
})
export class ProseEditorComponent implements OnInit {
  @ViewChild('proseMirror', { static: true })
  public proseMirror!: ProseMirrorComponent;

  public schema = new Schema({
    nodes: addListNodes(
      basicSchema.spec.nodes,
      'paragraph (ordered_list | bullet_list)*',
      'block',
    ),
    marks: basicSchema.spec.marks,
  });

  public state = EditorState.create({
    schema: this.schema,
    plugins: [
      // table
      columnResizing(),
      tableEditing(),
      // input 입력 시 동작할 것들
      inputRules({
        rules: [
          ...smartQuotes,
          ellipsis,
          // emDash,
          blockQuoteRule(this.schema.nodes['blockquote']),
          orderedListRule(this.schema.nodes['ordered_list']),
          bulletListRule(this.schema.nodes['bullet_list']),
          codeBlockRule(this.schema.nodes['code_block']),
          headingRule(this.schema.nodes['heading'], 6),
          horizontalSeparatorRule(this.schema.nodes['horizontal_rule']),
        ],
      }),
      // 키맵 설정
      keymap({
        Tab: goToNextCell(1),
        'Shift-Tab': goToNextCell(-1),
        ...buildBasicKeymap(this.schema),
        ...baseKeymap,
      }),
      dropCursor(),
      gapCursor(),
      menuBar({
        floating: false,
        content: buildMenuItems(this.schema).fullMenu,
      }),
      history(),
      new Plugin({
        props: {
          attributes: { class: 'ProseMirror-Root-Class' },
        },
      }),
    ],
  });

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public constructor() {
    const fix = fixTables(this.state);
    if (fix) this.state = this.state.apply(fix.setMeta('addToHistory', false));

    // this.view = new EditorView(this.editor.nativeElement, {
    //   attributes: {
    //     spellcheck: 'false',
    //   },
    //   state: state,
    //   nodeViews: {
    //     // table: (node, view, getPos) => {
    //     //   console.log(node, view, getPos);
    //     //   return new TableView(node, 100);
    //     // },
    //   },
    //   dispatchTransaction: (transaction) => {
    //     const newState = this.view.state.apply(transaction);
    //     this.view.updateState(newState);
    //   },
    // });

    document.execCommand('enableObjectResizing', false, 'false');
    document.execCommand('enableInlineTableEditing', false, 'false');
  }

  public heading(level: number): void {
    const { state, dispatch } = this.proseMirror.editorView;
    const { $from, $to } = state.selection;
    const from = $from.pos;
    const to = $to.pos;
    dispatch(
      state.tr
        .setBlockType(from, to, this.schema.nodes['heading'], { level })
        .scrollIntoView(),
    );
  }

  public addHorizontalLine(): void {
    const { state, dispatch } = this.proseMirror.editorView;
    const node = this.schema.nodes['horizontal_rule'];
    dispatch(state.tr.replaceSelectionWith(node.create()));
    this.proseMirror.editorView.focus();
  }

  public toggleBold(): void {
    const { state, dispatch } = this.proseMirror.editorView;
    toggleMark(this.schema.marks['strong'])(state, dispatch);
    this.proseMirror.editorView.focus();
  }

  public ngOnInit(): void {
    console.log(this);
  }
}
