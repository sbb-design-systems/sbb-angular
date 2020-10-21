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
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { TabContent } from './tab-content';

let counter = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'attr.role': 'tabpanel',
    '[attr.id]': 'id',
    '[attr.attr.aria-labelledby]': 'labelId',
    '[attr.aria-hidden]': "active ? 'false' : 'true'",
  },
})
export class TabComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Tab identifier
   */
  @Input()
  id: string;

  /**
   * Label identifier of a tab
   */
  @Input()
  labelId: string;

  /**
   * Initial index tab
   * @deprecated internal detail
   */
  @Input()
  tabindex = -1;

  /**
   * Role of tab
   * @deprecated internal detail
   */
  role = 'tabpanel';

  /**
   * Class property that identifies an aria hidden of a tab
   * @deprecated internal detail
   */
  get ariaHidden(): string {
    return this.active ? 'false' : 'true';
  }

  private _disabled: boolean;
  /**
   * Disables this tab
   */
  @Input()
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    if (!!value) {
      this.disableChange.emit(this.id);
    }
  }

  get disabled() {
    return this._disabled;
  }
  /**
   * Label of a specific tab
   */
  @Input() label: string;
  /**
   * Class property that specifics tab status
   */
  @Input() active = false;
  /**
   * Class property that identifies the data-set for tabs content
   */
  @Input() badgePill?: number;
  /**
   * Event generated if a tab is disabled
   */
  @Output() disableChange = new EventEmitter();
  /**
   * Event generated if a tab is removed
   */
  @Output() removeChange = new EventEmitter();
  /**
   * Template provided in the tab content, which is lazily rendered
   */
  @ContentChild(TabContent, { read: TemplateRef, static: true }) _lazyTabContent: TemplateRef<any>;

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

  ngOnInit() {
    if (!this.id) {
      this.id = `content${counter++}-tab`;
    }
    if (!this.labelId) {
      this.labelId = `content${counter++}`;
    }
  }

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
