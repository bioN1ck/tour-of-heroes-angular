import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { Observable } from 'rxjs';

import { Hero } from '../../models/hero.model';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { HeroService } from '../../services/hero.service';
import { MessageService } from '../../services/message.service';

const COMPONENTS = [HeroDetailComponent];

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    RouterLinkWithHref,
    ...COMPONENTS,
  ],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesComponent {

  public readonly heroes$: Observable<Hero[]> = this.heroService.heroesList$;

  constructor(
    @Inject(HeroService) private readonly heroService: HeroService,
    @Inject(MessageService) private readonly messageService: MessageService,
  ) { }

  public add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHeroAction$$.next({ name });
  }

  public delete(hero: Hero): void {
    this.heroService.deleteHeroAction$$.next(hero);
  }

}
