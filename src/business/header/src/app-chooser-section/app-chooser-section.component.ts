import { ChangeDetectionStrategy, Component, HostListener, Inject, Input } from '@angular/core';

import { Header, SBB_HEADER } from '../header/header';

@Component({
  selector: 'sbb-app-chooser-section',
  templateUrl: './app-chooser-section.component.html',
  styleUrls: ['./app-chooser-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppChooserSectionComponent {
  @Input() label: string;

  constructor(@Inject(SBB_HEADER) private _header: Header) {}

  /** Close the header menu when any a or button child element is clicked. */
  @HostListener('click', ['$event'])
  _handleChildClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target && target.tagName && (target.tagName === 'A' || target.tagName === 'BUTTON')) {
      this._header.opened = false;
    }
  }
}
