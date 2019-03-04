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
  Output,
  Optional,
  Self
} from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { GhettoboxIconDirective } from './ghettobox-icon.directive';
import { Ghettobox } from './ghettobox-ref';
import { RouterLink } from '@angular/router';
import { GhettoboxAnimations } from './ghettobox-animations';
import { GhettoboxContainerService } from '../ghettobox-container/ghettobox-container.service';
import { QueryParamsHandling } from '@angular/router/src/config';

/** Ghettobox states used for the animation */
export type GhettoboxState = 'added' | 'deleted';

/** Ghettobox deleted custom event  */
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

  /**
   * RouterLink as input directive or routerlink from ghettobox object when added by the Service
   */
  @Input()
  set routerLink(value: any[] | string) { this._routerLink = value; }
  get routerLink() {
    return this._routerLink || (this.ghettobox && this.ghettobox.link ? this.ghettobox.link.routerLink : undefined);
  }
  private _routerLink: any[] | string;

  /**
   * Retrive the routerLink from the proper source
   */
  get link() { return this._routerLinkDirective || (this.ghettobox ? this.ghettobox.link : undefined); }

  @Input() queryParams: { [k: string]: any };

  @Input() fragment: string;

  @Input() queryParamsHandling: QueryParamsHandling;

  @Input() preserveFragment: boolean;

  @Input() skipLocationChange: boolean;

  @Input() replaceUrl: boolean;

  @Input() state?: { [k: string]: any };

  @HostBinding('attr.tabindex') tabIndex = '-1';

  /**
   * Get/Set ghettobox state
   */
  private _ghettoboxState: GhettoboxState = 'added';
  get ghettoboxState() {
    return this._ghettoboxState;
  }
  set ghettoboxState(value: GhettoboxState) {
    this._ghettoboxState = value;
    this._changeDetector.markForCheck();
  }

  /**
   * Emit a GhettoboxDeletedEvent after every ghettobox deletion
   */
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

  /**
   * Ghettobox Default icon as a TemplateRef if any are not specified
   */
  @ViewChild('defaultIcon') iconDefault: TemplateRef<any>;

  /**
   * Ghettobox Icon
   */
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

  /**
   * ghettobox object which construct the ghettobox when it's being created by the GhettoboxService
   */
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

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _ghettoboxContainerService: GhettoboxContainerService,
    @Optional() @Self() private _routerLinkDirective: RouterLink) {
  }

  /**
   * Delete itself
   * @param evt native dom event
   */
  delete(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.destroy();
  }

  /**
   * The actual destroy action which set the state to 'deleted'
   * and remove itself from the attachedGhettoboxes collection stored within the GhettoboxService
   */
  destroy(): void {
    this.ghettoboxState = 'deleted';

    if (this._ghettoboxContainerService.hasContainerLoaded) {
      this._ghettoboxContainerService.deleteFromAttachedGhettoboxesCollection(this.id);
    }
  }

  /** @docs-private */
  handleAnimation(event: AnimationEvent) {
    const { phaseName, toState } = event;

    if (phaseName === 'done' && toState === 'deleted') {
      this.deletedPhase();
    }
  }

  /** @docs-private */
  private deletedPhase() {
    this.visible = false;
    this.role = undefined;
    this.ariaHidden = 'true';
    this._changeDetector.markForCheck();
    this.afterDelete.emit({ ghettoboxState: this.ghettoboxState, ghettoboxId: this.id });
  }

}
