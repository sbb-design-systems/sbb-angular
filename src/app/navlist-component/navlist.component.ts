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
  }

  async navigate(path : any) {
    // navigate to clicked component ...
    await this.router.navigateByUrl('/', {skipLocationChange: true});
    this.router.navigate([path]);
  }
}
