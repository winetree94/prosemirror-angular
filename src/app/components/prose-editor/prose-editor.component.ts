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
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
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
  Italic,
  Strong,
  Code,
  History,
  BasicKeymap,
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
      Italic(),
      Strong(),
      Code(),
      BasicKeymap(),
      History(),
    ],
    nativePlugins: () => [dropCursor(), gapCursor()],
  }).configure();

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public constructor() {
    // const fix = fixTables(this.state);
    // if (fix) this.state = this.state.apply(fix.setMeta('addToHistory', false));
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

  public ngOnInit(): void {
    return;
  }
}
