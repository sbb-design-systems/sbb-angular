import { Injectable } from '@angular/core';

export class FakeMediaQueryList {
  /** The callback for change events. */
  private _listeners: ((mql: MediaQueryListEvent) => void)[] = [];

  constructor(public matches: boolean, public media: string) {}

  /** Toggles the matches state and "emits" a change event. */
  setMatches(matches: boolean) {
    this.matches = matches;

    /** Simulate an asynchronous task. */
    setTimeout(() => {
      this._listeners.forEach((listener) => listener(this as any));
    });
  }

  /** Registers a callback method for change events. */
  addListener(callback: (mql: MediaQueryListEvent) => void) {
    this._listeners.push(callback);
  }

  /** Removes a callback method from the change events. */
  removeListener(callback: (mql: MediaQueryListEvent) => void) {
    const index = this._listeners.indexOf(callback);

    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }
}

@Injectable()
export class FakeMediaMatcher {
  defaultMatches: boolean = true;

  /** A map of match media queries. */
  private _queries = new Map<string, FakeMediaQueryList>();

  /** The number of distinct queries created in the media matcher during a test. */
  get queryCount(): number {
    return this._queries.size;
  }

  /** Fakes the match media response to be controlled in tests. */
  matchMedia(query: string): FakeMediaQueryList {
    const mql = new FakeMediaQueryList(this.defaultMatches, query);
    this._queries.set(query, mql);
    return mql;
  }

  /** Clears all queries from the map of queries. */
  clear() {
    this._queries.clear();
  }

  /** Toggles the matching state of the provided query. */
  setMatchesQuery(query: string, matches: boolean) {
    if (this._queries.has(query)) {
      this._queries.get(query)!.setMatches(matches);
    } else {
      throw Error('This query is not being observed.');
    }
  }
}
