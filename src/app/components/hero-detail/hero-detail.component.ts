import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { AsyncPipe, Location, NgIf, UpperCasePipe } from '@angular/common';
import { combineLatestWith, map, Observable, takeUntil, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero.service';
import { DestroyService } from '../../services/destroy.service';
import { ROUTE_PARAM_STREAM, routeParamFactory } from '../../tokens/route.token';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [FormsModule, NgIf, UpperCasePipe, AsyncPipe],
  providers: [
    {
      provide: ROUTE_PARAM_STREAM,
      useFactory: routeParamFactory('id'),
      deps: [Injector]
    },
    DestroyService,
  ],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDetailComponent implements OnInit {

  public readonly hero$: Observable<Hero | null> = this.heroId$.pipe(
    combineLatestWith(this.heroService.heroesList$),
    map(([id, heroes]) => {
      const hero = heroes.find(h => h.id === +id);
      return hero ? {...hero} : null;
    }),
  );

  constructor(
    @Inject(ROUTE_PARAM_STREAM) private readonly heroId$: Observable<string>,
    @Inject(HeroService) private readonly heroService: HeroService,
    @Inject(Location) private readonly location: Location,
    @Inject(DestroyService) private readonly destroy: DestroyService,
  ) { }

  public ngOnInit(): void {
    this.heroService.heroUpdated$.pipe(
      takeUntil(this.destroy),
      tap(() => this.goBack())
    ).subscribe();
  }

  public goBack(): void {
    this.location.back();
  }

  public save(hero: Hero): void {
    this.heroService.updateHeroAction$$.next(hero);
  }

}
