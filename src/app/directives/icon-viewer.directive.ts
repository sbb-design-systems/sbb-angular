import { Directive, ViewContainerRef, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { map } from '../shared/sbb-components-mapping-export';
import { UiIcon } from '../shared/ui-icon';

@Directive({
  selector: '[sbbIconViewer]'
})
export class IconViewerDirective implements OnInit {

  @Input() sbbIconViewer: UiIcon;
  @Input() singleOrMultiple: string;

  private iconClasses = [
    'icon-sm',
    'icon-lg',
    'icon-2x',
    'icon-3x',
    'icon-5x',
    'icon-7x'
  ];

  constructor(private viewContainer: ViewContainerRef,private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadIconComponent();
  }

  private loadIconComponent(): void {
    if (!this.sbbIconViewer || !this.singleOrMultiple) {
         console.error('The input parameter sbbIconViewer or singleOrMultiple is required');
    } else {
      const componentFactory = this.resolver.resolveComponentFactory(map[this.sbbIconViewer['name']]);
      if(this.singleOrMultiple.toLocaleLowerCase().startsWith('single')) {
         const componentRef = this.viewContainer.createComponent(componentFactory);
         componentRef.instance['svgClass'] = 'icon-flex-column icon-lg';
      } else {
         this.iconClasses.forEach( iconClass => {
           const componentRef = this.viewContainer.createComponent(componentFactory);
           componentRef.instance['svgClass'] = 'icon-flex-column ' + iconClass;
        });
      }
    }
  }

}
