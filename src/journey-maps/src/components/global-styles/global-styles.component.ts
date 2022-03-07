import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'rokas-global-styles',
  template: '',
  styleUrls: ['./global-styles.component.scss'],
  encapsulation: ViewEncapsulation.None
})

// (AFAIK) We cannot apply global CSS styles via angular.json for a library.
// This component with ViewEncapsulation.None is a workaround.
// Styles defined here will be applied to all elements.
export class GlobalStylesComponent {

  constructor() {
  }

}
