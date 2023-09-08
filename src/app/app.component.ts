import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProsemirrorModule } from './components/prose-mirror/prosemirror.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProsemirrorModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'prosemirror-angular-standalone';
}
