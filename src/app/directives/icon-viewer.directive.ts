import { Directive, ViewContainerRef, OnInit, Input, ComponentFactoryResolver, OnChanges, SimpleChanges } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { iconComponentDetails } from '../svg-icon-collection';

@Directive({
  selector: '[sbbIconViewer]'
})
export class IconViewerDirective implements OnChanges {


  @Input() sbbIconViewer: UiIcon;

  constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

  loadIconComponent(): void {
    const component = iconComponentDetails.find(i => i.name === this.sbbIconViewer.name).component;
    const componentFactory = this.resolver.resolveComponentFactory(component);
    this.viewContainer.createComponent(componentFactory);
  }

  replaceIconcomponent(): any {
    this.viewContainer.clear();
    this.loadIconComponent();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.replaceIconcomponent();
  }

}
