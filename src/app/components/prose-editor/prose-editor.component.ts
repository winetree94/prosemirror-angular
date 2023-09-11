import {
  ApplicationRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  NgZone,
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
  AngularAdapter,
} from '../prose-mirror/extensions/builtin';
import { EditorState } from 'prosemirror-state';
import { NgMenubarView } from 'src/app/components/prose-editor/menubar/menubar';

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
  private readonly ngZone = inject(NgZone);
  private readonly environmentInjector = inject(EnvironmentInjector);

  @ViewChild('menubarContentRoot', { static: true, read: ViewContainerRef })
  public menubarContentRoot!: ViewContainerRef;

  @ViewChild('menubar', { static: true })
  public menubar!: ProseEditorMenubarComponent;

  @ViewChild('proseMirror', { static: true })
  public proseMirror!: ProseMirrorComponent;

  public state!: EditorState;

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public ngOnInit(): void {
    this.state = new PMEditor({
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
        AngularAdapter({
          applicationRef: this.applicationRef,
          environmentInjector: this.environmentInjector,
          zone: this.ngZone,
          view: NgMenubarView,
        }),
        History(),
      ],
      nativePlugins: () => [dropCursor(), gapCursor()],
    }).configure();
    return;
  }
}
