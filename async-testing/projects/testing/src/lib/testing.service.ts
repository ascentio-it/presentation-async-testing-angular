import { Injectable } from '@angular/core';
import { from, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TestingService {
  private value: number = 0;

  increment(): Observable<number> {
    this.value++;

    return new Observable<number>((observer) => {
      observer.next(this.value)
    }).pipe(debounceTime(2500));
  }

  decrement(): Observable<number> {
    this.value--;
    
    return new Observable<number>((observer) => {
      observer.next(this.value)
    }).pipe(debounceTime(2500));
  }
}