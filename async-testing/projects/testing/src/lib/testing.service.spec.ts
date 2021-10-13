import { TestScheduler } from "rxjs/testing";
import { TestingService } from "./testing.service";
import { addMatchers, cold, getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { fakeAsync } from "@angular/core/testing";
describe('TestingService', () => {
  let testingService: TestingService;

  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  beforeEach(() => {
    testingService = new TestingService();
  });

  describe('testScheduler', () => {
    it('tests against the returned observable', () => {
      testScheduler.run((helpers) => {
        helpers.expectObservable(testingService.decrement()).toBe('2500ms a', {a: -1});
      });
    });
  });

  describe('jasmine-marbles', () => {
    it('tests against the returned observable', async () => {
      expect(testingService.decrement()).toBeObservable(cold('2500ms a', {a: -1}));
    });
  });
});