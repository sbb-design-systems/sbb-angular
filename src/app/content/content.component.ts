import { Component, OnInit, ViewChild } from '@angular/core';
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
  codeSource = `showCode() {\n //write it out ...\n alert('Source code goes here ...');\n}`;
  codeImport = `showCode() {\n //write it out ...\n alert('Import code goes here ...');\n}`;
  codeGettingStarted = `showCode() {\n //write it out ...\n alert('Getting started code goes here ...');\n}`;
  codeModelBinding = `showCode() {\n //write it out ...\n alert('Model binding code goes here ...');\n}`;
  codeIcons = `showCode() {\n //write it out ...\n alert('Icons code goes here ...');\n}`;
  codeAutoResize = `showCode() {\n //write it out ...\n alert('Auto resize code goes here ...');\n}`;
  codeProperties = `showCode() {\n //write it out ...\n alert('Properties code goes here ...');\n}`;
  codeEvents = `showCode() {\n //write it out ...\n alert('Events code goes here ...');\n}`;
  codeStyling = `showCode() {\n //write it out ...\n alert('Styling code goes here ...');\n}`;
  codeDependencies = `showCode() {\n //write it out ...\n alert('Dependencies code goes here ...');\n}`;

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
        this.codeSource = '<' + this.uiIcon.selector + ' svgClass="..."></' + this.uiIcon.selector + '>';
      }
    });
  }

  navigateHome() {
    // navigate to clicked component ...
    this.router.navigate(['']);
  }

}
