import { Directive, Input, NgZone } from '@angular/core';
import { ɵvariant } from '@sbb-esta/angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';
import { ExampleData } from '@sbb-esta/components-examples';

import { StackBlitzWriter } from './stack-blitz-writer';

@Directive({
  selector: 'button[sbb-stack-blitz-button]',
  host: {
    '(click)': 'openStackBlitz()',
  },
  standalone: false,
})
export class StackBlitzButton {
  exampleData?: ExampleData;

  /**
   * Function that can be invoked to open the StackBlitz window synchronously.
   *
   * **Note**: All files for the StackBlitz need to be loaded and prepared ahead-of-time,
   * because doing so on-demand will cause Firefox to block the submit as a popup as the
   * form submission (used internally to create the StackBlitz) didn't happen within the
   * same tick as the user interaction.
   */
  private _openStackBlitzFn: ((isSbbLean: boolean) => void) | null = null;

  @Input()
  set example(exampleId: string | undefined) {
    if (exampleId) {
      this.exampleData = new ExampleData(exampleId);
      this._prepareStackBlitzForExample(exampleId, this.exampleData);
    } else {
      this.exampleData = undefined;
      this._openStackBlitzFn = null;
    }
  }

  constructor(
    private _stackBlitzWriter: StackBlitzWriter,
    private _ngZone: NgZone,
    private _notificationToast: SbbNotificationToast,
  ) {}

  openStackBlitz(): void {
    if (this._openStackBlitzFn) {
      this._openStackBlitzFn(ɵvariant.value === 'lean');
    } else {
      this._notificationToast.open(
        'StackBlitz is not ready yet. Please try again in a few seconds.',
        undefined,
      );
    }
  }

  private _prepareStackBlitzForExample(exampleId: string, data: ExampleData): void {
    this._ngZone.runOutsideAngular(async () => {
      const isTest = exampleId.includes('harness');
      this._openStackBlitzFn = await this._stackBlitzWriter.createStackBlitzForExample(
        exampleId,
        data,
        isTest,
      );
    });
  }
}
