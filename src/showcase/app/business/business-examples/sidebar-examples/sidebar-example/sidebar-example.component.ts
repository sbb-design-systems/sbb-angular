import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { FakeMediaMatcher } from '@sbb-esta/angular-core/testing';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sbb-sidebar-example',
  templateUrl: './sidebar-example.component.html',
  styleUrls: ['./sidebar-example.component.css'],
  providers: [
    FakeMediaMatcher,
    { provide: MediaMatcher, useExisting: FakeMediaMatcher },
    BreakpointObserver,
  ], // The providers are only for demo purposes, don't use it in your code
})
export class SidebarExampleComponent implements AfterViewInit, OnDestroy {
  simulateMobile = new FormControl(false);
  private _destroyed = new Subject();

  constructor(private _mediaMatcher: FakeMediaMatcher) {}

  ngAfterViewInit(): void {
    this.simulateMobile.valueChanges
      .pipe(startWith(this.simulateMobile.value), takeUntil(this._destroyed))
      .subscribe((matches) => this._mediaMatcher.setMatchesQuery(Breakpoints.Mobile, matches));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
