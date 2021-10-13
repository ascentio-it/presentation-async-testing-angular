import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators'

@Component({
  selector: 'lib-testing',
  template: `
	<label  id="label">{{ value }}</label>
									
  <button (click)="increment()" id="increment-button">increment</button>
  <button (click)="decrement()" id="decrement-button">decrement</button>
  `
})
export class TestingComponent implements OnInit, OnDestroy {
  value$ = new Subject<number>();
  value: number = 0;

  ngOnInit(): void {
    this.value$.pipe(debounceTime(2500)).subscribe((value) => {
        this.value = value
      });
  }

  ngOnDestroy(): void {
    if (this.value$) {
      this.value$.unsubscribe();
    }
  }

  increment() {
    setTimeout(() => {
        this.value += 1;
    }, 2500);
  }

  decrement() {
    const value = this.value - 1;
    this.value$.next(value);
  }
}
