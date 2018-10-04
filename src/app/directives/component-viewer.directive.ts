import { Directive, ViewContainerRef, OnInit, Input, ComponentFactoryResolver, Component, Type } from '@angular/core';
import { UiComponent } from '../shared/ui-component';


@Directive({
    selector: '[sbbComponentViewer]'
})
export class ComponentViewerDirective implements OnInit {

    @Input() sbbComponentViewer: UiComponent;

    constructor(private viewContainer: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.loadComponent();
    }

    loadComponent(): void {
        const componentFactory = this.resolver.resolveComponentFactory(this.sbbComponentViewer.component);
        this.viewContainer.createComponent(componentFactory);
    }

}
