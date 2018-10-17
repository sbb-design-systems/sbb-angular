import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input, HostBinding,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  OnDestroy,
  Type
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit, OnDestroy {
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'frameless' = 'primary';
  @Input() icon: Type<{}>;
  @ViewChild('iconContainer', { read: ViewContainerRef }) iconContainer;

  componentRef: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver) { }

  @HostBinding('class') buttonModeClass: string;

  ngOnInit() {
    this.buttonModeClass = `sbb-button--${this.mode}`;

    this.createComponent();
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }

  createComponent() {
    this.iconContainer.clear();
    console.log('createComponent', this.icon);
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.icon);
    this.componentRef = this.iconContainer.createComponent(factory);
  }

}
