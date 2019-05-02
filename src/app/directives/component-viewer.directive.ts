import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';

import { UiComponent } from '../shared/ui-component';

@Directive({
  selector: '[sbbComponentViewer]'
})
export class ComponentViewerDirective implements OnInit {

  @Input() sbbComponentViewer: UiComponent;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent(): void {
    const componentFactory = this._resolver.resolveComponentFactory(this.sbbComponentViewer.component);
    this._viewContainer.createComponent(componentFactory);
  }

}
