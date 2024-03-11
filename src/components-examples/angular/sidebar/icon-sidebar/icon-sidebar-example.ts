import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { Breakpoints, SbbOptionModule } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { SbbFormField } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbSelect } from '@sbb-esta/angular/select';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Icon Sidebar
 * @order 20
 */
@Component({
  selector: 'sbb-icon-sidebar-example',
  templateUrl: 'icon-sidebar-example.html',
  styleUrls: ['icon-sidebar-example.css'],
  providers: [
    FakeMediaMatcher,
    { provide: MediaMatcher, useExisting: FakeMediaMatcher },
    BreakpointObserver,
  ],
  standalone: true,
  imports: [
    SbbSidebarModule,
    SbbIconModule,
    SbbCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    SbbOptionModule,
    SbbSelect,
    SbbFormField,
  ],
})
export class IconSidebarExample implements AfterViewInit, OnDestroy {
  expanded = false;
  position = new FormControl<'start' | 'end'>('start', { nonNullable: true });
  simulateMobile = new FormControl(false, { initialValueIsDefault: true });
  private _destroyed = new Subject<void>();

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
