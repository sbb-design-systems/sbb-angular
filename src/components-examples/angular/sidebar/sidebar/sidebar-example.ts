import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { Breakpoints, SbbOptionModule } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { SbbFormField } from '@sbb-esta/angular/form-field';
import { SbbSelect } from '@sbb-esta/angular/select';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Sidebar
 * @order 10
 */
@Component({
  selector: 'sbb-sidebar-example',
  templateUrl: 'sidebar-example.html',
  styleUrls: ['sidebar-example.css'],
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
    SbbSelect,
    SbbOptionModule,
    SbbFormField,
  ],
})
export class SidebarExample implements AfterViewInit, OnDestroy {
  position = new FormControl<'start' | 'end'>('start', { nonNullable: true });
  simulateMobile = new FormControl(false, { initialValueIsDefault: true });
  private _mediaMatcher = inject(FakeMediaMatcher);
  private _destroyed = new Subject<void>();

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
