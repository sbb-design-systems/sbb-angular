import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICON_COMPONENT_META_INFORMATION } from '@sbb-esta/angular-icons';
import { IconBase } from '@sbb-esta/angular-icons';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'sbb-icon-search',
  templateUrl: './icon-search.component.html',
  styleUrls: ['./icon-search.component.scss']
})
export class IconSearchComponent {
  filter = new FormControl('');

  icons: Observable<{ selector: string; portal: ComponentPortal<IconBase> }[]>;

  constructor() {
    this.icons = this.filter.valueChanges.pipe(
      startWith(''),
      map(f =>
        ICON_COMPONENT_META_INFORMATION.filter(i => i.name.substring(4).includes(f))
          .concat(ICON_COMPONENT_META_INFORMATION.filter(i => i.meta.some(m => m.includes(f))))
          .filter((v, i, a) => a.findIndex(j => j.selector === v.selector) === i)
      ),
      map(icons =>
        icons.map(i => ({
          selector: i.selector,
          portal: new ComponentPortal<IconBase>(i.component)
        }))
      )
    );
  }
}
