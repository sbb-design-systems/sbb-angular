import { Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[sbbBreadcrumbLevel]'
})
export class BreadcrumbLevelDirective {


  constructor(public elementRef: ElementRef, public templateRef: TemplateRef<any>) { }
}
