import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbSidebarContainer } from '@sbb-esta/angular-business/sidebar';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { FakeMediaMatcher } from '@sbb-esta/angular-core/testing';
import { startWith } from 'rxjs/operators';

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
export class SidebarExampleComponent implements AfterViewInit {
  @ViewChild(SbbSidebarContainer) sbbSidebarContainer;
  simulateMobile = new FormControl(false);

  constructor(private _mediaMatcher: FakeMediaMatcher) {}

  ngAfterViewInit(): void {
    this.simulateMobile.valueChanges
      .pipe(startWith(this.simulateMobile.value))
      .subscribe((value) => this._mediaMatcher.setMatchesQuery(Breakpoints.Mobile, value));
  }
}
