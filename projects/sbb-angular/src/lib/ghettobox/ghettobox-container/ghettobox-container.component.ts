import {
  Component, ChangeDetectionStrategy, Input, HostBinding,
  ViewChild, ComponentRef, EmbeddedViewRef, AfterViewInit, OnDestroy, ContentChild, ContentChildren, QueryList, AfterContentInit
} from '@angular/core';
import { CdkPortalOutlet, BasePortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { GhettoboxService } from '../ghettobox/ghettobox.service';
import { GhettoboxComponent } from '../ghettobox/ghettobox.component';
import { GhettoboxRef } from '../ghettobox/ghettobox-ref';

let counter = 0;

@Component({
  selector: 'sbb-ghettobox-container',
  templateUrl: './ghettobox-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GhettoboxContainerComponent extends BasePortalOutlet implements AfterContentInit, OnDestroy {

  @Input() @HostBinding('attr.id')
  ghettoContainerId = `sbb-ghettobox-container-${counter++}`;

  @HostBinding('attr.role') role = 'region';

  @HostBinding('attr.aria-live') ariaLive = 'assertive';

  @HostBinding('class.sbb-ghettobox-container')
  containerClass = true;

  @HostBinding('attr.tabindex')
  tabIndex = '-1';

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  @ContentChildren(GhettoboxComponent) initialGhettoboxes: QueryList<GhettoboxComponent>;

  constructor(private _ghettoboxService: GhettoboxService) {
    super();
    if (!this._ghettoboxService.containerInstance) {
      this._ghettoboxService.containerInstance = this;
    } else {
      throw Error('Its allowed only one container at a time');
    }
  }

  ngAfterContentInit() {
    this._ghettoboxService
      .loadInitialGhettoboxes(this.initialGhettoboxes.toArray().map(g => new GhettoboxRef(undefined, g)));
  }

  ngOnDestroy() {
    this._ghettoboxService.containerInstance = undefined;
    this._ghettoboxService.clear();
  }

  /**
   * Attach a ComponentPortal as content to this ghettobox container.
   * @param portal Portal to be attached as the ghettobox content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this.portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this ghettobox container.
   * @param portal Portal to be attached as the ghettobox content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this.portalOutlet.attachTemplatePortal(portal);
  }

}

