import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProseEditorComponent } from 'src/app/components/prose-editor/prose-editor.component';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProseEditorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public globalService = inject(GlobalService);
  enable = true;
}
