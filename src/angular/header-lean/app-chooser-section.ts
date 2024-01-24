import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TypeRef } from '@sbb-esta/angular/core';

import type { SbbHeaderLean } from './header';
import { SBB_HEADER } from './header-token';

@Component({
  selector: 'sbb-app-chooser-section',
  templateUrl: './app-chooser-section.html',
  styleUrls: ['./app-chooser-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-app-chooser',
  },
  standalone: true,
})
export class SbbAppChooserSection {
  @Input() label: string;

  constructor(@Inject(SBB_HEADER) private _header: TypeRef<SbbHeaderLean>) {}

  /** Close the header menu when any a or button child element is clicked. */
  @HostListener('click', ['$event'])
  _handleChildClick(event: TypeRef<Event>) {
    const target = event.target as HTMLElement;
    if (target && target.tagName && (target.tagName === 'A' || target.tagName === 'BUTTON')) {
      this._header.opened = false;
    }
  }
}
