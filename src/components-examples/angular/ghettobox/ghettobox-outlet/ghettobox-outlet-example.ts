import { Component, OnInit } from '@angular/core';
import {
  SbbGhettoboxConfig,
  SbbGhettoboxRef,
  SbbGhettoboxService,
} from '@sbb-esta/angular/ghettobox';

let nextId = 1;

/**
 * @title Ghettobox Outlet
 * @order 40
 */
@Component({
  selector: 'sbb-ghettobox-outlet-example',
  templateUrl: './ghettobox-outlet-example.html',
})
export class GhettoboxOutletExample implements OnInit {
  private _refs: SbbGhettoboxRef[] = [];

  constructor(private _ghettoboxService: SbbGhettoboxService) {}

  ngOnInit(): void {
    this.add();
    this.add({ routerLink: { routerLink: '#' } });
    this.add({ link: 'https://sbb.ch' });
    this.add({ svgIcon: 'fpl:disruption' });
    this.add({ svgIcon: 'kom:eye-disabled-small' });
  }

  add(config?: SbbGhettoboxConfig) {
    const currentId = nextId++;
    const ref = this._ghettoboxService.add(
      `An important message to inform clients of a problem/incident ${currentId}`,
      config
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
