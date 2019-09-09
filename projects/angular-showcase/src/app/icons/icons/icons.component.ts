import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { ICON_COMPONENT_META_INFORMATION } from '@sbb-esta/angular-icons';

import { HtmlLoader } from '../../shared/html-loader.service';

@Component({
  selector: 'sbb-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  providers: [HtmlLoader]
})
export class IconsComponent {
  icons = ICON_COMPONENT_META_INFORMATION.map(i => ({
    selector: i.selector,
    portal: new ComponentPortal(i.component)
  })).sort((a, b) => a.selector.localeCompare(b.selector));
}
