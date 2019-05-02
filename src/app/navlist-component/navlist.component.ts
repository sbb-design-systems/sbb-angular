import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ComponentUiService } from '../services/component-ui.service';
import { UiComponent } from '../shared/ui-component';

@Component({
  selector: 'sbb-navlist',
  templateUrl: './navlist.component.html',
  styleUrls: ['./navlist.component.scss']
})
export class NavlistComponent implements OnInit {

  foundUiComponents: UiComponent[] = [];

  constructor(
    private _componentUiService: ComponentUiService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.foundUiComponents = this._componentUiService.getAll();
  }

  async navigate(path: any) {
    await this._router.navigateByUrl('/', { skipLocationChange: true });
    this._router.navigate([path]);
  }
}
