import { Directive, InjectionToken, TemplateRef } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `SbbTabContent`. It serves as
 * alternative token to the actual `SbbTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_TAB_CONTENT = new InjectionToken<SbbTabContent>('SbbTabContent');

/** Decorates the `ng-template` tags and reads out the template from it. */
@Directive({
  selector: '[sbbTabContent]',
  providers: [{ provide: SBB_TAB_CONTENT, useExisting: SbbTabContent }],
})
export class SbbTabContent {
  constructor(/** Content for the tab. */ public template: TemplateRef<any>) {}
}
