import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: `[sbbMenuDynamicTrigger]`,
  exportAs: 'sbbMenuDynamicTrigger',
})
export class SbbMenuDynamicTrigger {
  constructor(readonly _templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    viewContainerRef.createEmbeddedView(_templateRef);
  }
}
