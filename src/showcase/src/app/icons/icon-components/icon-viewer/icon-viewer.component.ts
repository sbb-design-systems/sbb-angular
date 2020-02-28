import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconBase } from '@sbb-esta/angular-icons';
import { ICON_COMPONENT_META_INFORMATION } from '@sbb-esta/angular-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sbb-icon-viewer',
  templateUrl: './icon-viewer.component.html',
  styleUrls: ['./icon-viewer.component.scss']
})
export class IconViewerComponent implements OnInit {
  title: Observable<string>;
  icon: Observable<{
    selector: string;
    name: string;
    modules: string[];
    portal: ComponentPortal<IconBase>;
  }>;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this.title = this._route.params.pipe(map(({ id }) => id));
    this.icon = this.title.pipe(
      map(s => ICON_COMPONENT_META_INFORMATION.filter(i => i.selector === s)[0]),
      map(i => ({
        selector: i.selector,
        name: i.name,
        modules: i.modules,
        portal: new ComponentPortal<IconBase>(i.component)
      }))
    );
  }
}
