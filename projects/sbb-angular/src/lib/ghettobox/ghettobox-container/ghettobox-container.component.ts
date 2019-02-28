import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ViewChild,
  ComponentRef,
  EmbeddedViewRef,
  OnDestroy,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { CdkPortalOutlet, BasePortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { GhettoboxComponent } from '../ghettobox/ghettobox.component';
import { GhettoboxRef, Ghettobox } from '../ghettobox/ghettobox-ref';
import { GhettoboxContainerService } from './ghettobox-container.service';

let counter = 0;

@Component({
  selector: 'sbb-ghettobox-container',
  templateUrl: './ghettobox-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GhettoboxContainerComponent extends BasePortalOutlet implements AfterContentInit, OnDestroy {

  @Input() @HostBinding()
  id = `sbb-ghettobox-container-${counter++}`;

  @HostBinding('attr.role') role = 'region';

  @HostBinding('attr.aria-live') ariaLive = 'assertive';

  @HostBinding('attr.aria-relevant') ariaRelevant = 'all';

  @HostBinding('class.sbb-ghettobox-container')
  containerClass = true;

  @HostBinding('attr.tabindex')
  tabIndex = '-1';

  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  @ContentChildren(GhettoboxComponent) initialGhettoboxes: QueryList<GhettoboxComponent>;

  constructor(private _ghettoboxServiceContainer: GhettoboxContainerService) {
    super();
    if (!this._ghettoboxServiceContainer.hasContainerLoaded) {
      this._ghettoboxServiceContainer.loadContainer(this);
    } else {
      throw Error('Only one sbb-ghettobox-container is allowed at a time');
    }
  }

  ngAfterContentInit() {
    this._ghettoboxServiceContainer
      .loadInitialGhettoboxes(this.initialGhettoboxes.toArray().map(g => new GhettoboxRef(g)));
  }

  ngOnDestroy() {
    this._ghettoboxServiceContainer.clearAll();
    this._ghettoboxServiceContainer.clearContainer();
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

  createGhettobox(ghettobox: Ghettobox): GhettoboxRef {
    const ghettoboxComponentPortal = new ComponentPortal(GhettoboxComponent);
    const ghettoboxComponentRef = this.attachComponentPortal(ghettoboxComponentPortal);
    ghettoboxComponentRef.instance.ghettobox = ghettobox;

    return new GhettoboxRef(ghettoboxComponentRef);
  }

}
