import {
  Component,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  ViewChild,
  Input,
  HostBinding,
  ChangeDetectorRef,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { GhettoboxIconDirective } from './ghettobox-icon.directive';
import { Ghettobox } from './ghettobox-ref';
import { RouterLink } from '@angular/router';
import { GhettoboxAnimations } from './ghettobox-animations';
import { QueryParamsHandling } from '@angular/router/src/config';
import { GhettoboxContainerService } from '../ghettobox-container/ghettobox-container.service';

export type GhettoboxState = 'added' | 'deleted';

export interface GhettoboxDeletedEvent {
  ghettoboxState: GhettoboxState;
  ghettoboxId: string;
}

let counter = 0;

@Component({
  selector: 'sbb-ghettobox',
  templateUrl: './ghettobox.component.html',
  styleUrls: ['./ghettobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [GhettoboxAnimations.addDelete]
})
export class GhettoboxComponent {

  visible = true;

  @Input() routerLink: RouterLink;

  @Input() queryParams: { [k: string]: any };

  @Input() fragment: string;

  @Input() queryParamsHandling: QueryParamsHandling;

  @Input() preserveFragment: boolean;

  @Input() skipLocationChange: boolean;

  @Input() replaceUrl: boolean;

  @Input() state?: { [k: string]: any };

  @HostBinding('attr.tabindex') tabIndex = '-1';

  private _ghettoboxState: GhettoboxState = 'added';
  get ghettoboxState() {
    return this._ghettoboxState;
  }
  set ghettoboxState(value: GhettoboxState) {
    this._ghettoboxState = value;
    this._changeDetector.markForCheck();
  }

  @Output() afterDelete = new EventEmitter<GhettoboxDeletedEvent>();

  @HostBinding('hidden')
  get hidden() {
    return !this.visible;
  }

  @Input() @HostBinding()
  id = `sbb-ghettobox-${counter++}`;

  @HostBinding('class.sbb-ghettobox-outer-wrapper') ghettoboxClass = true;

  @HostBinding('attr.role') role = 'alert';

  @HostBinding('attr.aria-hidden') ariaHidden: 'false' | 'true';

  @ViewChild('defaultIcon') iconDefault: TemplateRef<any>;

  private _icon: TemplateRef<any>;
  @ContentChild(GhettoboxIconDirective, { read: TemplateRef })
  set icon(value: TemplateRef<any>) {
    this._icon = value;
  }
  get icon(): TemplateRef<any> {
    if (!this._icon) {
      return this.iconDefault;
    }
    return this._icon;
  }

  private _ghettobox: Ghettobox;
  get ghettobox() {
    return this._ghettobox;
  }
  set ghettobox(value: Ghettobox) {
    this._ghettobox = value;

    if (this._ghettobox.icon) {
      this.icon = this._ghettobox.icon;
    }
    this._changeDetector.markForCheck();
  }

  get hasGettoboxLink() {
    return this.ghettobox ? this.ghettobox.link : false;
  }

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _ghettoboxContainerService: GhettoboxContainerService) {
  }

  delete(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.destroy();
  }

  destroy(): void {
    this.ghettoboxState = 'deleted';

    if (this._ghettoboxContainerService.hasContainerLoaded) {
      this._ghettoboxContainerService.deleteFromAttachedGhettoboxesCollection(this.id);
    }
  }

  handleAnimation(event: AnimationEvent) {
    const { phaseName, toState } = event;

    if (phaseName === 'done' && toState === 'deleted') {
      this.deletedPhase();
    }
  }

  private deletedPhase() {
    this.visible = false;
    this.role = undefined;
    this.ariaHidden = 'true';
    this._changeDetector.markForCheck();
    this.afterDelete.emit({ ghettoboxState: this.ghettoboxState, ghettoboxId: this.id });
  }

}
