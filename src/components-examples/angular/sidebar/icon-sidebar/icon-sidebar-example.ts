import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Breakpoints } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Icon Sidebar
 * @order 20
 */
@Component({
  selector: 'sbb-icon-sidebar-example',
  templateUrl: './icon-sidebar-example.html',
  styleUrls: ['./icon-sidebar-example.css'],
  providers: [
    FakeMediaMatcher,
    { provide: MediaMatcher, useExisting: FakeMediaMatcher },
    BreakpointObserver,
  ], // The providers are only for demo purposes, don't use it in your code
})
export class IconSidebarExample implements AfterViewInit, OnDestroy {
  expanded = false;
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
