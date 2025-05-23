import { _IdGenerator } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SbbAlert } from './alert';
import { SbbAlertConfig } from './alert-config';
import { SbbAlertRef, SbbAlertRefConnector } from './alert-ref';
import { SbbAlertService } from './alert-service';

/**
 * This component is used for handle a collection of alerts via the AlertService.
 */
@Component({
  selector: 'sbb-alert-outlet',
  templateUrl: './alert-outlet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-alert-outlet',
    '[id]': 'id',
    role: 'region',
    'aria-live': 'assertive',
    'aria-relevant': 'all',
    tabindex: '-1',
  },
  imports: [SbbAlert, RouterLink],
})
export class SbbAlertOutlet implements OnDestroy {
  private _alertService = inject(SbbAlertService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @Input() id: string = inject(_IdGenerator).getId('sbb-alert-outlet-');

  /** The portal where to attach the alerts generated by the service. */
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) _outletRef: ViewContainerRef;

  @ViewChild('standard', { static: true }) _templateStandard: TemplateRef<any>;
  @ViewChild('routerLink', { static: true }) _templateRouterLink: TemplateRef<any>;
  @ViewChild('externalLink', { static: true }) _templateExternalLink: TemplateRef<any>;

  constructor(...args: unknown[]);
  constructor() {
    this._alertService._register(this);
  }

  ngOnDestroy() {
    this._alertService._unregister(this);
  }

  /** Creates a new ComponentPortal of an Alert and attach it to the cdkPortalOutlet */
  createAlert(message: string, config: SbbAlertConfig): SbbAlertRef {
    const template = this._selectTemplate(config);
    const connector = new SbbAlertRefConnector(message, config);
    const ref = new SbbAlertRef(this, connector);
    ref.instance = this._outletRef.createEmbeddedView(template, { connector });
    this._changeDetectorRef.markForCheck();
    return ref;
  }

  /** Dismiss all alert instances from this outlet. */
  dismissAll() {
    this._outletRef.clear();
  }

  private _selectTemplate(config: SbbAlertConfig) {
    if (config.link) {
      return this._templateExternalLink;
    } else if (config.routerLink) {
      return this._templateRouterLink;
    }

    return this._templateStandard;
  }
}
