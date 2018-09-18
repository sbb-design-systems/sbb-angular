import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentUiService } from '../services/component-ui.service';
import { UiComponent } from '../shared/ui-component';

@Component({
  selector: 'sbb-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  id: string;

  uiComponent : UiComponent;

  options = { theme: 'default', language: 'typescript', readOnly: true };
  codeSource         = `showCode() {\n //write it out ...\n alert('Source code goes here ...');\n}`;
  codeImport         = `showCode() {\n //write it out ...\n alert('Import code goes here ...');\n}`;
  codeGettingStarted = `showCode() {\n //write it out ...\n alert('Getting started code goes here ...');\n}`;
  codeModelBinding   = `showCode() {\n //write it out ...\n alert('Model binding code goes here ...');\n}`;
  codeIcons          = `showCode() {\n //write it out ...\n alert('Icons code goes here ...');\n}`;
  codeAutoResize     = `showCode() {\n //write it out ...\n alert('Auto resize code goes here ...');\n}`;
  codeProperties     = `showCode() {\n //write it out ...\n alert('Properties code goes here ...');\n}`;
  codeEvents         = `showCode() {\n //write it out ...\n alert('Events code goes here ...');\n}`;
  codeStyling        = `showCode() {\n //write it out ...\n alert('Styling code goes here ...');\n}`;
  codeDependencies   = `showCode() {\n //write it out ...\n alert('Dependencies code goes here ...');\n}`;
  
  constructor(private componentUiService: ComponentUiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.uiComponent = this.componentUiService.getUiComponentByRouterLink(this.id);
  }

  navigateHome() {
    // navigate to clicked component ...
    this.router.navigate(['']);
  }

}