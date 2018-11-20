import {
  Component,
  Input,
  HostBinding,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';

let counter = 0;

@Component({
  selector: 'sbb-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TabComponent implements OnInit, OnChanges, OnDestroy {

  @HostBinding('attr.id')
  @Input() id: string;

  @HostBinding('attr.aria-labelledby')
  @Input() labelId: string;

  @HostBinding('attr.tabindex')
  @Input() tabindex = 0;

  @HostBinding('attr.role')
  role = 'tabpanel';

  @HostBinding('class')
  get hostClasses(): string {
    return ['sbb-tabs-tabpanel',
      this.active ? '' : 'is-hidden',
      this.disabled ? 'is-disabled' : ''].join(' ');
  }

  private _disabled: boolean;

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

  @Input() label: string;
  @Input() active = false;
  @Input() badgePill?: number;

  @Output() disableChange = new EventEmitter();
  @Output() removeChange = new EventEmitter();

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  constructor(private _changeDetector: ChangeDetectorRef) { }

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
