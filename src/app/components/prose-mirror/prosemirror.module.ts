import { Injector, NgModule } from '@angular/core';
import { ProseMirrorComponent } from './prose-mirror.component';
import { ParagraphComponent } from './node-views/paragraph/paragraph.component';
import { createCustomElement } from '@angular/elements';
import { ProseMirrorToolbarComponent } from 'src/app/components/prose-mirror/toolbar/prose-mirror-toolbar.component';

@NgModule({
  imports: [
    ProseMirrorComponent,
    ProseMirrorToolbarComponent,
    ParagraphComponent,
  ],
  exports: [ProseMirrorComponent, ProseMirrorToolbarComponent],
})
export class ProsemirrorModule {
  constructor(private injector: Injector) {
    const MyElement = createCustomElement(ParagraphComponent, {
      injector: this.injector,
    });
    customElements.define('ng-paragraph', MyElement);
  }
}
