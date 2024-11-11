import { Component } from '@angular/core';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';

/**
 * @title Simple Loading
 * @order 10
 */
@Component({
  selector: 'sbb-loading-indicator-simple-example',
  templateUrl: 'loading-indicator-simple-example.html',
  styleUrls: ['loading-indicator-simple-example.css'],
  imports: [SbbLoadingIndicatorModule],
})
export class LoadingIndicatorSimpleExample {}
