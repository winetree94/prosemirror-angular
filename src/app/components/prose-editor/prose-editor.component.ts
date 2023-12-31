import {
  ApplicationRef,
  Component,
  EnvironmentInjector,
  ViewChild,
  ViewContainerRef,
  forwardRef,
  inject,
} from '@angular/core';
import { EditorProps } from 'prosemirror-view';
import { ProseMirrorModule } from '../prose-mirror/prose-mirror.module';
import { ProseMirrorComponent } from '..//prose-mirror/prose-mirror.component';
import { ProseEditorMenubarComponent } from './menubar/prose-editor-menubar.component';
import { PMEditor } from '../prose-mirror/extensions/extension';
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
import { NgMenubarView } from './menubar/menubar';
import { menuBar } from 'src/app/components/prose-mirror/plugins/menu-bar/menubar';
import { buildMenuItems } from 'src/app/components/prose-mirror/plugins/menu-bar/basic-menu-items';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Node } from 'prosemirror-model';

@Component({
  selector: 'ng-prose-editor',
  templateUrl: './prose-editor.component.html',
  styleUrls: ['./prose-editor.component.scss'],
  standalone: true,
  imports: [ProseMirrorModule, ProseEditorMenubarComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProseEditorComponent),
      multi: true,
    },
  ],
})
export class ProseEditorComponent implements ControlValueAccessor {
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
      Text(),
      Paragraph({ addListNodes: true }),
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
      menuBar({
        content: buildMenuItems(schema).fullMenu,
      }),
    ],
  }).configure();

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public writeValue(value: string): void {
    const node = Node.fromJSON(this.state.schema, JSON.parse(value));
    const state = EditorState.create({
      doc: node,
      schema: this.state.schema,
      plugins: this.state.plugins,
      selection: this.state.selection,
      storedMarks: this.state.storedMarks,
    });
    if (!this.proseMirror.editorView) {
      this.state = state;
    } else {
      this.proseMirror.writeValue(state);
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.proseMirror.registerOnChange((state) =>
      fn(JSON.stringify(state.doc.toJSON())),
    );
  }

  public registerOnTouched(fn: () => void): void {
    this.proseMirror.registerOnTouched(fn);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.proseMirror.setDisabledState(isDisabled);
  }
}
