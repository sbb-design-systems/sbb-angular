import { Component, OnInit } from '@angular/core';
import { ComponentUiService } from '../services/component-ui.service';
import { UiComponent } from '../shared/ui-component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sbb-navlist',
  templateUrl: './navlist.component.html',
  styleUrls: ['./navlist.component.scss']
})
export class NavlistComponent implements OnInit {

  foundUiComponents: UiComponent[] = [];

  constructor(private componentUiService: ComponentUiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.foundUiComponents = this.componentUiService.getAll();
    // write it out ...
    console.log('UI Component', this.foundUiComponents);
  }

  navigate(path : any) {
    // write it out ...
    console.log(path);
    // navigate to button ...
    this.router.navigate(path);
  }
}