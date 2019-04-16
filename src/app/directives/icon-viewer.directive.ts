import { ComponentFactoryResolver, Directive, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { iconComponentsMetaInformation } from 'sbb-angular-icons';
import { UiIcon } from '../shared/ui-icon';

@Directive({
  selector: '[sbbIconViewer]'
})
export class IconViewerDirective implements OnChanges {


  @Input() sbbIconViewer: UiIcon;
  @Input() size: 'fixed' | undefined;
  @Input() svgWidth: string;
  @Input() svgHeight: string;

  constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

  loadIconComponent(): void {
    const component = iconComponentsMetaInformation.find(i => i.name === this.sbbIconViewer.name).component;
    const componentFactory = this.resolver.resolveComponentFactory(component);
    const componentRef = this.viewContainer.createComponent(componentFactory);
    if (this.size) {
      componentRef.instance.size = 'fixed';
    }
    if (this.svgHeight) {
      componentRef.instance.height = this.svgHeight;
    }
    if (this.svgWidth) {
      componentRef.instance.width = this.svgWidth;
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
