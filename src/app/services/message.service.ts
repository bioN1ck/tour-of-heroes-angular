import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly messages$$ = new BehaviorSubject<string[]>([]);
  public readonly messages$ = this.messages$$.asObservable();

  public add(message: string): void {
    this.messages$$.next([...this.messages$$.getValue(), message])
  }

  public clear(): void {
    this.messages$$.next([]);
  }

}
