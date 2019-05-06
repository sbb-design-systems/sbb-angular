import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnChanges,
  ViewContainerRef
} from '@angular/core';
import { iconComponentsMetaInformation } from '@sbb-esta/angular-icons';

import { UiIcon } from '../shared/ui-icon';

@Directive({
  selector: '[sbbIconViewer]'
})
export class IconViewerDirective implements OnChanges {
  @Input() sbbIconViewer: UiIcon;
  @Input() size: 'fixed' | undefined;
  @Input() svgWidth: string;
  @Input() svgHeight: string;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _resolver: ComponentFactoryResolver
  ) {}

  loadIconComponent(): void {
    const component = iconComponentsMetaInformation.find(
      i => i.name === this.sbbIconViewer.name
    ).component;
    const componentFactory = this._resolver.resolveComponentFactory(component);
    const componentRef = this._viewContainer.createComponent(componentFactory);
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
    this._viewContainer.clear();
    this.loadIconComponent();
  }

  ngOnChanges() {
    this.replaceIconcomponent();
  }
}
