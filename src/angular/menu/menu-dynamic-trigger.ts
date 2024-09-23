import { Directive, inject, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: `[sbbMenuDynamicTrigger]`,
  exportAs: 'sbbMenuDynamicTrigger',
  standalone: true,
})
export class SbbMenuDynamicTrigger {
  readonly _templateRef = inject<TemplateRef<any>>(TemplateRef);

  constructor(...args: unknown[]);
  constructor() {
    const _templateRef = this._templateRef;
    const viewContainerRef = inject(ViewContainerRef);

    viewContainerRef.createEmbeddedView(_templateRef);
  }
}
