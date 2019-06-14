import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentUiService } from '../services/component-ui.service';
import { IconUiService } from '../services/icon-ui.service';
import { FADE_ANIMATION } from '../shared/animations';
import { UiComponent } from '../shared/ui-component';
import { UiIcon } from '../shared/ui-icon';

@Component({
  selector: 'sbb-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [FADE_ANIMATION]
})
export class ContentComponent implements OnInit {
  id: string;

  uiComponent: UiComponent;
  uiIcon: UiIcon;
  isSourceTabClicked: boolean;
  options = {
    theme: 'default',
    language: 'typescript',
    readOnly: true,
    automaticLayout: true
  };
  componentDocLoaded: boolean;

  constructor(
    private _componentUiService: ComponentUiService,
    private _iconUiService: IconUiService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.componentDocLoaded = false;
    this._route.params.subscribe(params => {
      this.id = params['id'];

      this.uiComponent = this._componentUiService.getUiComponentByRouterLink(this.id);

      if (!this.uiComponent) {
        this.uiIcon = this._iconUiService.getUiIconByRouterLink(this.id);
      }
      this.componentDocLoaded = true;
    });
  }
}
