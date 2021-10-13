import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestingComponent } from './testing.component';
import { TestScheduler } from 'rxjs/testing';

describe('TestingComponent', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // detectChanges so ngOnInit gets called
  });

  afterEach(() => {
    jest.useRealTimers()
  });

  describe('asynchronous testing', () => {
    describe('increment', () => {
      describe('synchronous', () => {
        it('should fail to register because of timeout in code', () => {
          clickIncrementButton();

          fixture.detectChanges();

          const value = getValueFromView();

          expect(value).toEqual('0');
        });
      });

      describe('fakeAsnync', () => {
        it('should register with a tick of 2500 using fakeAsync', fakeAsync(() => {
          clickIncrementButton();

          tick(2500); // wait for the first task to get done
          fixture.detectChanges(); 

          const value = getValueFromView();

          expect(value).toEqual('1');
        }));
      });

      describe('fakeTimers', () => {
        it('should register using fakeTimers', () => {
          jest.useFakeTimers();
          
          clickIncrementButton();

          jest.advanceTimersByTime(2500)
          fixture.detectChanges(); 

          const value = getValueFromView();

          expect(value).toEqual('1');
          jest.runOnlyPendingTimers();
        });
      });

      // TODO: figure out why waitForAsync does nothing. It should work, but it doesn't :-(
      xit(
        'should fail to register because waitForAsync does not wait for observable to complete',
        waitForAsync(() => {
          clickIncrementButton();

          fixture.whenStable().then(() => {
            fixture.detectChanges();
            console.log('is stable');
            console.log(component.value);

            const value = getValueFromView();

            expect(value).toEqual('1');
          });
        })
      );
    });

    describe('decrement', () => {
      describe('synchronous', () => {
        it('should fail to register because of timeout in code', () => {
          clickDecrementButton();

          fixture.detectChanges();

          const value = getValueFromView();

          expect(value).toEqual('0');
        });
      });

      describe('subscribing', () => {
        it('should register because done gets called in the subscribe', (done) => {
          component.value$.subscribe(() => {
            fixture.detectChanges();

            done();

            const value = getValueFromView();
            expect(value).toEqual('-1');
          });

          clickDecrementButton();
        });

        it('does not actually call the expect without using done', () => {
          clickDecrementButton();

          component.value$.subscribe(() => {
            fixture.detectChanges();
  
            const value = getValueFromView();
            expect(value).toEqual('100');
          });
        });
      });
      
      describe('fakeAsync', () => {
        it('should register with a tick of 2500 and fakeAsync', fakeAsync(() => {
          clickDecrementButton();

          tick(2500);
          fixture.detectChanges();

          const value = getValueFromView();

          expect(value).toEqual('-1');
        }));
      });

      describe('fakeTimers', () => {
        it('should register using fakeTimers', () => {
          jest.useFakeTimers();
          
          clickDecrementButton();

          jest.advanceTimersByTime(2500)
          fixture.detectChanges(); 

          const value = getValueFromView();

          expect(value).toEqual('-1');
          jest.runOnlyPendingTimers();
        });
      });

      // TODO: figure out why waitForAsync does nothing. It should work, but it doesn't :-(
      xit(
        'should fail to register because waitForAsync does not wait for observable to complete',
        waitForAsync(() => {
          clickDecrementButton();

          fixture.whenStable().then(() => {
            fixture.detectChanges();

            const value = getValueFromView();

            expect(value).toEqual('-1');
          });
        })
      );
    });
  });

  const getValueFromView = ( ): string =>
    fixture.debugElement.query(By.css('label')).nativeElement.innerHTML;

  const clickIncrementButton = () =>
    fixture.debugElement.query(By.css('#increment-button')).triggerEventHandler('click', null);

  const clickDecrementButton = () =>
    fixture.debugElement.query(By.css('#decrement-button')).triggerEventHandler('click', null);
});
