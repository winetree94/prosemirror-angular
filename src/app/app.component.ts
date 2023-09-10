import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProseEditorComponent } from 'src/app/components/prose-editor/prose-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProseEditorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  enable = true;
}
