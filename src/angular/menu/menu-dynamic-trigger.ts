import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: `[sbbMenuDynamicTrigger]`,
  exportAs: 'sbbMenuDynamicTrigger',
  standalone: true,
})
export class SbbMenuDynamicTrigger {
  constructor(
    readonly _templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
  ) {
    viewContainerRef.createEmbeddedView(_templateRef);
  }
}
