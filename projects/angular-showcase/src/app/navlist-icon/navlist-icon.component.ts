import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IconUiService } from '../services/icon-ui.service';
import { UiIcon } from '../shared/ui-icon';

@Component({
  selector: 'sbb-navlist-icon',
  templateUrl: './navlist-icon.component.html',
  styleUrls: ['./navlist-icon.component.scss']
})
export class NavlistIconComponent implements OnInit {
  foundUiIcons: UiIcon[] = [];

  constructor(private _iconUiService: IconUiService) {}

  ngOnInit() {
    this.foundUiIcons = this._iconUiService.getAll();
  }
}
