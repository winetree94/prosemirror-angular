import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Schema, DOMParser } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { exampleSetup } from 'src/app/components/prose-mirror/examples';
import { schema } from 'src/app/components/prose-mirror/scheme-basic/scheme-basic';

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
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
    marks: schema.spec.marks,
  });

  public ngOnInit() {
    this.view = new EditorView(this.editor.nativeElement, {
      state: EditorState.create({
        schema: this.mySchema,
        doc: DOMParser.fromSchema(this.mySchema).parse(
          this.content.nativeElement,
        ),
        plugins: exampleSetup({ schema: this.mySchema }),
      }),
    });
  }
}
