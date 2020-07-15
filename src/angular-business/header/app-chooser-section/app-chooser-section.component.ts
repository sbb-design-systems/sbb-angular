import { ChangeDetectionStrategy, Component, HostListener, Inject, Input } from '@angular/core';
import { TypeRef } from '@sbb-esta/angular-core/common-behaviors';

import { SBB_HEADER } from '../header/header-token';
import type { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'sbb-app-chooser-section',
  templateUrl: './app-chooser-section.component.html',
  styleUrls: ['./app-chooser-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppChooserSectionComponent {
  @Input() label: string;

  constructor(@Inject(SBB_HEADER) private _header: TypeRef<HeaderComponent>) {}

  /** Close the header menu when any a or button child element is clicked. */
  @HostListener('click', ['$event'])
  _handleChildClick(event: TypeRef<Event>) {
    const target = event.target as HTMLElement;
    if (target && target.tagName && (target.tagName === 'A' || target.tagName === 'BUTTON')) {
      this._header.opened = false;
    }
  }
}
