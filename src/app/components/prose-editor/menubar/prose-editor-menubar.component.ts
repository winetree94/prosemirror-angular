import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

@Component({
  selector: 'ng-prose-editor-menubar',
  templateUrl: './prose-editor-menubar.component.html',
  styleUrls: ['./prose-editor-menubar.component.scss'],
  standalone: true,
})
export class ProseEditorMenubarComponent implements OnDestroy, PluginView {
  private readonly _cdr = inject(ChangeDetectorRef);

  public update(editorView: EditorView, prevState: EditorState): void {
    console.log(editorView, prevState);
  }

  public ngOnDestroy(): void {
    console.log('menubar destroy');
  }
}
