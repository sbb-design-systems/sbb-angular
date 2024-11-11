import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbExpansionPanel, SbbExpansionPanelHeader } from '@sbb-esta/angular/accordion';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { Breakpoints, SbbOptionModule } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { SbbFormField } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInput } from '@sbb-esta/angular/input';
import { SbbSelect } from '@sbb-esta/angular/select';
import { SbbSidebarContainer, SbbSidebarModule } from '@sbb-esta/angular/sidebar';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Collapsible Sidebar
 * @order 40
 */
@Component({
  selector: 'sbb-collapsible-sidebar-example',
  templateUrl: 'collapsible-sidebar-example.html',
  styleUrls: ['collapsible-sidebar-example.css'],
  providers: [
    FakeMediaMatcher,
    { provide: MediaMatcher, useExisting: FakeMediaMatcher },
    BreakpointObserver,
  ],
  imports: [
    SbbSidebarModule,
    SbbIconModule,
    SbbCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    SbbOptionModule,
    SbbSelect,
    SbbFormField,
    SbbExpansionPanel,
    SbbExpansionPanelHeader,
    SbbInput,
  ],
})
export class CollapsibleSidebarExample implements AfterViewInit, OnDestroy {
  @ViewChild(SbbSidebarContainer) sidebarContainer: SbbSidebarContainer;

  mode = new FormControl<'over' | 'side'>('over', { nonNullable: true });
  position = new FormControl<'start' | 'end'>('start', { nonNullable: true });
  collapsible = new FormControl(true);
  simulateMobile = new FormControl(false, { initialValueIsDefault: true });
  collapsibleTitle = new FormControl('SBB Angular');
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
