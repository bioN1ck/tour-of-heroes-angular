import { Inject, Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Hero } from '../models/hero.model';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private readonly heroesUrl = 'api/heroes';

  public readonly addHeroAction$$ = new Subject<Pick<Hero, 'name'>>();
  public readonly deleteHeroAction$$ = new Subject<Hero>();
  public readonly updateHeroAction$$ = new Subject<Hero>();

  private readonly fetchedHeroes$: Observable<Hero[]> = this.http
    .get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(() => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('Fetch heroes', [])),
    );

  public readonly heroAdded$: Observable<Hero> = this.addHeroAction$$.pipe(
    switchMap((heroToBeAdded) => this.addHero(heroToBeAdded)),
    shareReplay(1),
  );

  public readonly heroUpdated$: Observable<void> = this.updateHeroAction$$.pipe(
    switchMap((heroToBeUpdated) => this.updateHero(heroToBeUpdated)),
    shareReplay(1),
  );

  public readonly heroDeleted$: Observable<void> = this.deleteHeroAction$$.pipe(
    switchMap((heroToBeDeleted) => this.deleteHero(heroToBeDeleted)),
    shareReplay(1),
  );

  public readonly heroesEvent$ = merge(this.heroAdded$, this.heroUpdated$, this.heroDeleted$);

  public readonly heroesList$ = this.heroesEvent$.pipe(
    startWith(null),
    switchMap(() => this.fetchedHeroes$),
    shareReplay(1),
  );

  constructor(
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(MessageService) private readonly messageService: MessageService,
  ) { }

  public searchHeroes(term: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError('searchHeroes', [])),
    );
  }

  private addHero(name: Pick<Hero, 'name'>): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, name)
      .pipe(
        tap((hero: Hero) => this.log(`added hero with id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero')),
      );
  }

  private deleteHero(hero: Hero): Observable<void> {
    return this.http
      .delete<void>(`${this.heroesUrl}/${hero.id}`)
      .pipe(
        tap(() => this.log(`deleted hero id=${hero.id}`)),
        catchError(this.handleError<void>('deleteHero')),
      );
  }

  private updateHero(updatedHero: Hero): Observable<void> {
    return this.http
      .put<void>(`${this.heroesUrl}/${updatedHero.id}`, updatedHero)
      .pipe(
        tap(() => this.log(`updated hero id=${updatedHero.id}`)),
        catchError(this.handleError<void>('updateHero')),
      );
  }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }

}
