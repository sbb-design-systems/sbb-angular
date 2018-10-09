import { Directive, ViewContainerRef, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { UiComponent } from '../shared/ui-component';


@Directive({
    selector: '[sbbComponentViewer]'
})
export class ComponentViewerDirective implements OnInit {

    @Input() sbbComponentViewer: UiComponent;
    @Input() documentationPart: string;

    constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.loadComponent();
    }

    loadComponent(): void {
        let componentFactory;
        if(this.documentationPart) {
           if(this.documentationPart.startsWith('import')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationImportComponent);  
           }
           if(this.documentationPart.startsWith('source')) {
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationSourceComponent);  
           }
           if(this.documentationPart.startsWith('gettingStarted')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationGettingStartedComponent);  
           }
           if(this.documentationPart.startsWith('modelBinding')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationModelBindingComponent);  
           }
           if(this.documentationPart.startsWith('icons')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationIconsComponent);  
           }
           if(this.documentationPart.startsWith('autoResize')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationAutoResizeComponent);  
           }
           if(this.documentationPart.startsWith('properties')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationPropertiesComponent);  
           }
           if(this.documentationPart.startsWith('events')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationEventsComponent);  
           }
           if(this.documentationPart.startsWith('styling')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationStylingComponent);  
           }
           if(this.documentationPart.startsWith('dependencies')) {             
              componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.documentationDependenciesComponent);  
           }
        } else {
           componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.component);
        }
        this.viewContainer.createComponent(componentFactory);
    }

}
