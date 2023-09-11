/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { EditorState, Plugin } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';

@Component({
  selector: 'div[ngProseMirror]',
  exportAs: 'ngProseMirror',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ProseMirrorComponent implements OnInit, OnDestroy {
  public readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  public editorView!: EditorView;

  @Input()
  public state!: EditorState;

  @Input()
  public plugins: Plugin[] = [];

  @Input()
  public attributes: DirectEditorProps['attributes'] = {};

  @Input()
  public nodeViews: DirectEditorProps['nodeViews'] = {};

  @Input()
  public dispatchTransaction: DirectEditorProps['dispatchTransaction'];

  @Input()
  public ngPlugins: Plugin[] = [];

  @Input()
  public handleKeydown: DirectEditorProps['handleKeyDown'];

  public ngOnInit(): void {
    this.editorView = new EditorView(this.elementRef.nativeElement, {
      state: this.state,
      attributes: this.attributes,
      nodeViews: this.nodeViews,
      plugins: this.plugins,
      dispatchTransaction: this.dispatchTransaction,
      handleKeyDown: this.handleKeydown,
    });
  }

  public ngOnDestroy(): void {
    this.editorView.destroy();
  }
}
