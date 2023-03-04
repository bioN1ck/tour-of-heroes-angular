import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { HeroesComponent } from './components/heroes/heroes.component';
import { MessagesComponent } from './components/messages/messages.component';

const COMPONENTS = [
  HeroesComponent,
  MessagesComponent,
]

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    ...COMPONENTS,
    RouterOutlet,
    RouterLinkWithHref,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Tour of heroes';
}
