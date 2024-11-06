import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

/**
 * @title Icon
 * @order 10
 */
@Component({
  selector: 'sbb-icon-simple-example',
  templateUrl: 'icon-simple-example.html',
  imports: [SbbIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSimpleExample {}
