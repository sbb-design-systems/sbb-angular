import {
  Component, ChangeDetectionStrategy, Input, HostBinding,
  ViewChild, ComponentRef, EmbeddedViewRef, AfterViewInit
} from '@angular/core';
import { CdkPortalOutlet, BasePortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { GhettoboxService } from '../ghettobox/ghettobox.service';

let counter = 0;

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwGhettoboxContentAlreadyAttachedError() {
  throw Error('Attempting to attach lightbox content after content is already attached');
}

@Component({
  selector: 'sbb-ghettobox-container',
  templateUrl: './ghettobox-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GhettoboxContainerComponent extends BasePortalOutlet {

  @Input() @HostBinding('attr.id')
  ghettoContainerId = `sbb-ghettobox-container-${counter++}`;

  @HostBinding('attr.role') role = 'region';

  @HostBinding('attr.aria-live') ariaLive = 'assertive';

  @HostBinding('class.sbb-ghettobox-container')
  containerClass = true;

  @HostBinding('attr.tabindex')
  tabIndex = '-1';

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  constructor(private _ghettoboxService: GhettoboxService) {
    super();
    this._ghettoboxService.containerInstance = this;
  }

  /**
   * Attach a ComponentPortal as content to this ghettobox container.
   * @param portal Portal to be attached as the ghettobox content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    // if (this.portalOutlet.hasAttached()) {
    //   throwGhettoboxContentAlreadyAttachedError();
    // }

    return this.portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this ghettobox container.
   * @param portal Portal to be attached as the ghettobox content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    // if (this.portalOutlet.hasAttached()) {
    //   throwGhettoboxContentAlreadyAttachedError();
    // }

    return this.portalOutlet.attachTemplatePortal(portal);
  }

}

