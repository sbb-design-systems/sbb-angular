import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { SbbTabContent } from './tab-content';

let nextId = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tabpanel',
    '[attr.id]': 'id',
    '[attr.attr.aria-labelledby]': 'labelId',
    '[attr.aria-hidden]': "active ? 'false' : 'true'",
  },
})
export class SbbTab implements OnChanges, OnDestroy {
  /** Tab identifier */
  @Input() id: string = `content${nextId++}-tab`;

  /** Label identifier of a tab */
  @Input() labelId: string = `content${nextId++}`;

  /** Disables this tab */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    if (!!value) {
      this.disableChange.emit(this.id);
    }
  }
  private _disabled: boolean;

  /** Label of a specific tab */
  @Input() label: string;
  /** Class property that specifics tab status */
  @Input() active: boolean = false;
  /** Class property that identifies the data-set for tabs content */
  @Input() badgePill?: number;
  /** Event generated if a tab is disabled */
  @Output() disableChange: EventEmitter = new EventEmitter();
  /** Event generated if a tab is removed */
  @Output() removeChange: EventEmitter = new EventEmitter();
  /** Template provided in the tab content, which is lazily rendered */
  @ContentChild(SbbTabContent, { read: TemplateRef, static: true }) _lazyTabContent: TemplateRef<
    any
  >;

  /**
   * Portal holding the user's lazy tab content
   * @docs-private
   */
  _contentPortal: TemplatePortal | null = null;

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    this._stateChanges.next();
  }

  tabMarkForCheck() {
    if (this.active && this._lazyTabContent) {
      this._contentPortal = new TemplatePortal(this._lazyTabContent, this._viewContainerRef);
    } else if (this._lazyTabContent) {
      this._contentPortal = null;
    }

    this._changeDetector.markForCheck();
  }

  ngOnDestroy() {
    this.removeChange.emit(this.id);
    this._stateChanges.complete();
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  // tslint:enable: member-ordering
}
