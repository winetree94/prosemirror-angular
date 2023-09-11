import {
  ApplicationRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { buildBasicKeymap } from '../prose-mirror/plugins/keymaps/basic-keymaps';
import { fixTables } from 'prosemirror-tables';
import { ProseMirrorModule } from 'src/app/components/prose-mirror/prose-mirror.module';
import { ProseMirrorComponent } from 'src/app/components/prose-mirror/prose-mirror.component';
import { EditorProps } from 'prosemirror-view';
import { ProseEditorMenubarComponent } from 'src/app/components/prose-editor/menubar/prose-editor-menubar.component';
import { PMEditor } from '../prose-mirror/extensions/state';
import {
  BlockQuote,
  Document,
  Separator,
  Heading,
  Paragraph,
  CodeBlock,
  Table,
  Text,
  HardBreak,
  Image,
  Link,
  EM,
  Strong,
  Code,
} from '../prose-mirror/extensions/builtin';

@Component({
  selector: 'ng-prose-editor',
  templateUrl: './prose-editor.component.html',
  styleUrls: ['./prose-editor.component.scss'],
  standalone: true,
  imports: [ProseMirrorModule, ProseEditorMenubarComponent],
})
export class ProseEditorComponent implements OnInit {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  @ViewChild('menubarContentRoot', { static: true, read: ViewContainerRef })
  public menubarContentRoot!: ViewContainerRef;

  @ViewChild('proseMirror', { static: true })
  public proseMirror!: ProseMirrorComponent;

  public state = new PMEditor({
    extensions: [
      Document(),
      Paragraph({ addListNodes: true }),
      Text(),
      BlockQuote(),
      Separator(),
      Heading({
        level: 6,
      }),
      CodeBlock(),
      Table(),
      HardBreak(),
      Image(),
      Link(),
      EM(),
      Strong(),
      Code(),
    ],
    nativePlugins: (schema) => [
      keymap({
        ...buildBasicKeymap(schema),
      }),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      history(),
    ],
  }).configure();

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

    // document.execCommand('enableObjectResizing', false, 'false');
    // document.execCommand('enableInlineTableEditing', false, 'false');
  }

  // public heading(level: number): void {
  //   const { state, dispatch } = this.proseMirror.editorView;
  //   const { $from, $to } = state.selection;
  //   const from = $from.pos;
  //   const to = $to.pos;
  //   dispatch(
  //     state.tr
  //       .setBlockType(from, to, this.schema.nodes['heading'], { level })
  //       .scrollIntoView(),
  //   );
  // }

  // public addHorizontalLine(): void {
  //   const { state, dispatch } = this.proseMirror.editorView;
  //   const node = this.schema.nodes['horizontal_rule'];
  //   dispatch(state.tr.replaceSelectionWith(node.create()));
  //   this.proseMirror.editorView.focus();
  // }

  // public toggleBold(): void {
  //   const { state, dispatch } = this.proseMirror.editorView;
  //   toggleMark(this.schema.marks['strong'])(state, dispatch);
  //   this.proseMirror.editorView.focus();
  // }

  public ngOnInit(): void {
    return;
    // // console.log(this);
    // const comp = createComponent(ParagraphComponent, {
    //   environmentInjector: this.environmentInjector,
    //   // hostElement: this.elementRef.nativeElement,
    // });
    // this.elementRef.nativeElement.append(comp.location.nativeElement);
    // this.applicationRef.attachView(comp.hostView);
  }
}
