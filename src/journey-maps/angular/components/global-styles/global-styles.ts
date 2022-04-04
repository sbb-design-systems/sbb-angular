import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-global-styles',
  template: '',
  styleUrls: ['./global-styles.css'],
  encapsulation: ViewEncapsulation.None,
})

// (AFAIK) We cannot apply global CSS styles via angular.json for a library.
// This component with ViewEncapsulation.None is a workaround.
// Styles defined here will be applied to all elements.
export class SbbGlobalStyles {}
