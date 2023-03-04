import { InjectionToken, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const ROUTE_PARAM_STREAM = new InjectionToken<Observable<string>>(
  'Stream of route param',
);

export function routeParamFactory(
  paramKey: string,
): (injector: Injector) => Observable<string | null> {
  return (injector: Injector): Observable<string | null> => {
    return injector.get(ActivatedRoute).paramMap
      .pipe(map(param => param.get(paramKey)));
  };
}
