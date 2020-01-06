import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';

let counter = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Tab identifier
   */
  @HostBinding('attr.id')
  @Input()
  id: string;

  /**
   * Label identifier of a tab
   */
  @HostBinding('attr.aria-labelledby')
  @Input()
  labelId: string;

  /**
   * Initial index tab
   */
  @HostBinding('attr.tabindex')
  @Input()
  tabindex = -1;

  /**
   * Role of tab
   */
  @HostBinding('attr.role')
  role = 'tabpanel';

  /**
   * Class property that identifies an aria hidden of a tab
   */
  @HostBinding('attr.aria-hidden')
  get ariaHidden(): string {
    return this.active ? 'false' : 'true';
  }

  private _disabled: boolean;
  /**
   * Disables this tab
   */
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;

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

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  constructor(private _changeDetector: ChangeDetectorRef) {}

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
    this._changeDetector.markForCheck();
  }

  ngOnDestroy() {
    this.removeChange.emit(this.id);
    this._stateChanges.complete();
  }
}
