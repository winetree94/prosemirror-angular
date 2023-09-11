import {
  ApplicationRef,
  Component,
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
import { EditorProps, EditorView } from 'prosemirror-view';
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
  AngularAdapter,
  Strikethrough,
  ResetOnEmpty,
} from '../prose-mirror/extensions/builtin';
import { EditorState } from 'prosemirror-state';
import { NgMenubarView } from 'src/app/components/prose-editor/menubar/menubar';
import { menuBar } from 'src/app/components/prose-mirror/plugins/menu-bar/menubar';
import { buildMenuItems } from 'src/app/components/prose-mirror/plugins/menu-bar/basic-menu-items';

@Component({
  selector: 'ng-prose-editor',
  templateUrl: './prose-editor.component.html',
  styleUrls: ['./prose-editor.component.scss'],
  standalone: true,
  imports: [ProseMirrorModule, ProseEditorMenubarComponent],
})
export class ProseEditorComponent implements OnInit {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  @ViewChild('menubarContentRoot', { static: true, read: ViewContainerRef })
  public menubarContentRoot!: ViewContainerRef;

  @ViewChild('menubar', { static: true })
  public menubar!: ProseEditorMenubarComponent;

  @ViewChild('proseMirror', { static: true })
  public proseMirror!: ProseMirrorComponent;

  public state: EditorState = new PMEditor({
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
      Strikethrough(),
      BasicKeymap(),
      ResetOnEmpty(),
      AngularAdapter({
        applicationRef: this.applicationRef,
        environmentInjector: this.environmentInjector,
        view: NgMenubarView,
      }),
      History(),
    ],
    nativePlugins: (schema) => [
      dropCursor(),
      gapCursor(),
      menuBar({
        content: buildMenuItems(schema).fullMenu,
      }),
    ],
  }).configure();

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public handleKeydown(view: EditorView, event: KeyboardEvent): boolean {
    return false; // Let ProseMirror handle the event as usual
  }

  public ngOnInit(): void {
    return;
  }
}
