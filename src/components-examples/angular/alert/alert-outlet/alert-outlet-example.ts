import { Component, inject, OnInit } from '@angular/core';
import { SbbAlertConfig, SbbAlertRef, SbbAlertService } from '@sbb-esta/angular/alert';
import { SbbAlertModule } from '@sbb-esta/angular/alert';
import { SbbButtonModule } from '@sbb-esta/angular/button';

let nextId = 1;

/**
 * @title Alert Outlet
 * @order 40
 */
@Component({
  selector: 'sbb-alert-outlet-example',
  templateUrl: 'alert-outlet-example.html',
  standalone: true,
  imports: [SbbAlertModule, SbbButtonModule],
})
export class AlertOutletExample implements OnInit {
  private _alertService = inject(SbbAlertService);
  private _refs: SbbAlertRef[] = [];

  ngOnInit(): void {
    this.add();
    this.add({ routerLink: { routerLink: '#' } });
    this.add({ link: 'https://sbb.ch' });
    this.add({ svgIcon: 'disruption' });
    this.add({ svgIcon: 'eye-disabled-small' });
  }

  add(config?: SbbAlertConfig) {
    const currentId = nextId++;
    const ref = this._alertService.add(
      `An important message to inform clients of a problem/incident ${currentId}`,
      config,
    );
    ref.afterDismissed().subscribe(() => {
      console.log(`${currentId} has been dismissed`);
      this._refs = this._refs.filter((r) => r !== ref);
    });
    this._refs.push(ref);
  }

  dismissFirst() {
    const ref = this._refs.shift();
    if (ref) {
      ref.dismiss();
    }
  }
}
