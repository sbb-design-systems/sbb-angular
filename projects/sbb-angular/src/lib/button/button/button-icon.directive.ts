import {
  Directive,
  ViewContainerRef,
  OnInit, OnDestroy, Input,
  ComponentFactoryResolver,
  ComponentFactory, Type,
  ComponentRef } from '@angular/core';

@Directive({
  selector: '[sbbButtonIcon]'
})
export class ButtonIconDirective implements OnInit, OnDestroy {
  @Input() sbbButtonIcon: Type<{}>;

  componentRef: ComponentRef<any>;

  constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    if (this.sbbButtonIcon) {
      this.loadIconComponent();
    }
  }

  ngOnDestroy() {
    if (this.sbbButtonIcon) {
      this.componentRef.destroy();
    }
  }

  loadIconComponent() {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.sbbButtonIcon);
    this.componentRef = this.viewContainer.createComponent(factory);
  }
}
