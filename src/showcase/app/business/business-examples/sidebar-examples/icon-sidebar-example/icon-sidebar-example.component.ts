import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbIconSidebarContainer } from '@sbb-esta/angular-business/sidebar';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { FakeMediaMatcher } from '@sbb-esta/angular-core/testing';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'sbb-icon-sidebar-example',
  templateUrl: './icon-sidebar-example.component.html',
  styleUrls: ['./icon-sidebar-example.component.css'],
  providers: [
    FakeMediaMatcher,
    { provide: MediaMatcher, useExisting: FakeMediaMatcher },
    BreakpointObserver,
  ], // The providers are only for demo purposes, don't use it in your code
})
export class IconSidebarExampleComponent implements AfterViewInit {
  @ViewChild(SbbIconSidebarContainer) sbbIconSidebarContainer;
  expanded = false;
  simulateMobile = new FormControl(false);

  constructor(private _mediaMatcher: FakeMediaMatcher) {}

  ngAfterViewInit(): void {
    this.simulateMobile.valueChanges
      .pipe(startWith(this.simulateMobile.value))
      .subscribe((value) => this._mediaMatcher.setMatchesQuery(Breakpoints.Mobile, value));
  }
}
