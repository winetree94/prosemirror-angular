/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorState, Plugin } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';

@Component({
  selector: 'div[ngProseMirror]',
  exportAs: 'ngProseMirror',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./prose-mirror.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProseMirrorComponent),
      multi: true,
    },
  ],
})
export class ProseMirrorComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  public editorView!: EditorView;

  private _disabled = false;
  private _onChange: ((value: EditorState) => void) | undefined;
  private _onTouched: (() => void) | undefined;

  @Input({ required: true })
  public state!: EditorState;

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
    if (!this.state) {
      throw new Error('No state provided');
    }
    this.editorView = new EditorView(this.elementRef.nativeElement, {
      state: this.state,
      attributes: this.attributes,
      nodeViews: this.nodeViews,
      dispatchTransaction: (tr) => {
        this.dispatchTransaction?.(tr);
        const nextState = this.editorView.state.apply(tr);
        this.editorView.updateState(nextState);
        this._onChange?.(nextState);
        this._onTouched?.();
      },
      handleKeyDown: (view, event) => {
        if (this.handleKeydown) {
          return this.handleKeydown(view, event);
        }
      },
      editable: () => !this._disabled,
    });
  }

  public writeValue(state: EditorState): void {
    if (this.editorView) {
      this.editorView.updateState(state);
    } else {
      this.state = state;
    }
  }

  public registerOnChange(fn: typeof this._onChange): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: typeof this._onTouched): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    // for internal change detection
    if (this.editorView) {
      this.editorView.updateState(this.state);
    }
  }

  public ngOnDestroy(): void {
    this.editorView.destroy();
  }
}
