import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentUiService } from '../services/component-ui.service';
import { UiComponent } from '../shared/ui-component';
import { IconUiService } from '../services/icon-ui.service';
import { UiIcon } from '../shared/ui-icon';

@Component({
  selector: 'sbb-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  id: string;

  uiComponent: UiComponent;
  uiIcon: UiIcon;
  isSourceTabClicked: boolean;

  options = { theme: 'default', language: 'typescript', readOnly: true, automaticLayout: true };

  constructor(private componentUiService: ComponentUiService,
    private iconUiService: IconUiService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.uiComponent = this.componentUiService.getUiComponentByRouterLink(this.id);
      if (!this.uiComponent) {
        this.uiComponent = this.iconUiService.getUiComponentByRouterLink(this.id);
        this.uiIcon = this.iconUiService.getUiIconByRouterLink(this.id);
        this.uiComponent.source = '<' + this.uiIcon.selector + ' svgClass="..."></' + this.uiIcon.selector + '>';
      }
    });
  }

  navigateHome() {
    // navigate to clicked component ...
    this.router.navigate(['']);
  }

}
