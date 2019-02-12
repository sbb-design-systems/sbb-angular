import { ComponentFactoryResolver, Directive, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { iconComponentDetails } from '../svg-icon-collection';

@Directive({
  selector: '[sbbIconViewer]'
})
export class IconViewerDirective implements OnChanges {


  @Input() sbbIconViewer: UiIcon;
  @Input() svgHeight: string;

  constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

  loadIconComponent(): void {
    const component = iconComponentDetails.find(i => i.name === this.sbbIconViewer.name).component;
    const componentFactory = this.resolver.resolveComponentFactory(component);
    const componentRef = this.viewContainer.createComponent(componentFactory);
    if (this.svgHeight) {
      componentRef.instance.height = this.svgHeight;
    } else {
      componentRef.instance.size = 'fixed';
    }
  }

  replaceIconcomponent(): any {
    this.viewContainer.clear();
    this.loadIconComponent();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.replaceIconcomponent();
  }

}
