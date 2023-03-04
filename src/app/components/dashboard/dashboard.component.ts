import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { map, Observable } from 'rxjs';

import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

const COMPONENTS = [
  HeroSearchComponent,
]

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    RouterLinkWithHref,
    ...COMPONENTS
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

  public readonly heroes$: Observable<Hero[]> = this.heroService.heroesList$
    .pipe(map(heroes => heroes.slice(1, 5)));

  constructor(
    @Inject(HeroService) private readonly heroService: HeroService,
  ) { }

}
