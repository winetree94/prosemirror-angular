import { Component, ElementRef, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'ng-paragraph',
  template: `template`,
  styleUrls: ['./paragraph.component.scss'],
  standalone: true,
  imports: [],
})
export class ParagraphComponent implements OnDestroy {
  public readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

  constructor() {
    console.log(this);
  }

  public ngOnDestroy(): void {
    console.log('destroy', this);
  }
}
