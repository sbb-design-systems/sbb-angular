import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { Breakpoints } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Multiple Sidebars
 * @order 30
 */
@Component({
  selector: 'sbb-multiple-sidebars-example',
  templateUrl: 'multiple-sidebars-example.html',
  styleUrls: ['multiple-sidebars-example.css'],
  providers: [
    FakeMediaMatcher,
    { provide: MediaMatcher, useExisting: FakeMediaMatcher },
    BreakpointObserver,
  ],
  standalone: true,
  imports: [
    SbbSidebarModule,
    SbbAccordionModule,
    SbbButtonModule,
    SbbCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MultipleSidebarsExample implements AfterViewInit, OnDestroy {
  simulateMobile = new FormControl(false, { initialValueIsDefault: true });
  private _destroyed = new Subject<void>();
  private _mediaMatcher = inject(FakeMediaMatcher);

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
