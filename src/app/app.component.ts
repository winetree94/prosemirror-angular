import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProseMirrorComponent } from 'src/app/components/prose-mirror/prose-mirror.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProseMirrorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'prosemirror-angular-standalone';
}
