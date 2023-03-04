import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero.service';

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
];

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [NgForOf, AsyncPipe, RouterLinkWithHref, ...MODULES],
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSearchComponent {

  public readonly searchInput = new FormControl<string>('');

  public readonly heroes$: Observable<Hero[]> = this.searchInput.valueChanges.pipe(
    debounceTime(300),
    map((term) => term && term.trim()),
    distinctUntilChanged(),
    switchMap(term => term ? this.heroService.searchHeroes(term) : of([])),
  );

  constructor(
    @Inject(HeroService) private readonly heroService: HeroService,
  ) {}

}
