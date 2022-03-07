import {bufferTimeOnValue} from './bufferTimeOnValue';
import {TestScheduler} from 'rxjs/testing';
import {buffer, bufferTime, debounceTime, delay, throttleTime} from 'rxjs/operators';
import {of} from 'rxjs';

const getTestScheduler = () => new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('marbles testing', () => {
  it('should delay', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const operation = delay(time);
      const actual   = 'abcdef--|';
      const expected = '--abcdef--|';

      expectObservable(cold(actual).pipe(operation)).toBe(expected);
    });
  });

  it('should throttleTime', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const operation = throttleTime(time);
      const actual   = 'abcdef---|';
      const expected = 'a--d-----|';

      expectObservable(cold(actual).pipe(operation)).toBe(expected);
    });
  });

  it('should debounceTime', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const operation = debounceTime(time);
      const actual   = 'abcdef--|';
      const expected = '-------f|';

      expectObservable(cold(actual).pipe(operation)).toBe(expected);
    });
  });

  it('should throttleTime and debounceTime', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const operation1 = throttleTime(time);
      const operation2 = debounceTime(time);
      const actual   = 'abcdef---|';
      const expected = '--a--d---|';

      expectObservable(cold(actual).pipe(operation1, operation2)).toBe(expected);
    });
  });

  it('should bufferTime 1', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const operation = bufferTime(time);
      const actual   = 'abcdef---|';
      const expected = '--x-y-z-w(w|)';
      const values = {
        x: ['a', 'b'],
        y: ['c', 'd', 'e'],
        z: ['f'],
        w: [],
      };

      expectObservable(cold(actual).pipe(operation)).toBe(expected, values);
    });
  });

  it('should buffer', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const operation = buffer(of(1).pipe(delay(time)));
      const actual   = 'abcdef---|';
      const expected = '--(x|)';
      const values = {
        x: ['a', 'b'],
      };

      expectObservable(cold(actual).pipe(operation)).toBe(expected, values);
    });
  });

  it('should buffer with throttleTime and debounceTime', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const actual   = 'abcdef---|';
      const expected = '--x--y---|';
      const values = {
        x: ['a', 'b', 'c'],
        y: ['d', 'e', 'f'],
      };

      const o$ = cold(actual);
      expectObservable(o$.pipe(buffer(o$.pipe(throttleTime(time), debounceTime(time))))).toBe(expected, values);
    });
  });

  it('should NOT emit with buffer with throttleTime and debounceTime if source has no events', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const actual   = '-------|';
      const expected = '-------|';

      const o$ = cold(actual);
      expectObservable(o$.pipe(buffer(o$.pipe(throttleTime(time), debounceTime(time))))).toBe(expected);
    });
  });
});

describe('bufferTimeOnValue', () => {
  it('should emit in groups of {x}ms', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const actual   = 'abcdef-----|';
      const expected = '--x--y-----|';
      const values = {
        x: ['a', 'b', 'c'],
        y: ['d', 'e', 'f'],
      };

      expectObservable(cold(actual).pipe(bufferTimeOnValue(time))).toBe(expected, values);
    });
  });

  it('should NOT emit if no source events', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const time = 2;
      const actual   = '-------|';
      const expected = '-------|';

      expectObservable(cold(actual).pipe(bufferTimeOnValue(time))).toBe(expected);
    });
  });
});
