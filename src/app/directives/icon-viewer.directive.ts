import { Directive, ViewContainerRef, OnInit, Input, ComponentFactoryResolver, OnChanges, SimpleChanges } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { IconComponents } from '../sbb-components-mapping-export';

@Directive({
  selector: '[sbbIconViewer]'
})
export class IconViewerDirective implements OnChanges {


  @Input() sbbIconViewer: UiIcon;
  @Input() singleOrMultiple: string;

  iconClasses = [
    'icon-sm',
    'icon-lg',
    'icon-2x',
    'icon-3x',
    'icon-5x',
    'icon-7x'
  ];

  constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

  loadIconComponent(): void {
    if (!this.sbbIconViewer || !this.singleOrMultiple) {
      console.error('The input parameter sbbIconViewer or singleOrMultiple is required');
    } else {
      const componentFactory = this.resolver.resolveComponentFactory(IconComponents.map[this.sbbIconViewer.name]);
      if (this.singleOrMultiple.toLocaleLowerCase().startsWith('single')) {
        const componentRef = this.viewContainer.createComponent(componentFactory);
        componentRef.instance['svgClass'] = 'icon-flex-column icon-lg';
      } else {
        this.iconClasses.forEach(iconClass => {
          const componentRef = this.viewContainer.createComponent(componentFactory);
          componentRef.instance['svgClass'] = 'icon-flex-column ' + iconClass;
        });
      }
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
