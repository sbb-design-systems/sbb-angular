import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

import { NavbuttonComponent } from '../navbutton/navbutton.component';

@Component({
  selector: 'sbb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  /**
   * Css class of a sbb-header
   */
  @HostBinding('class.sbb-header') cssClass = true;

  /**
   * Main title shown in the header.
   */
  @Input()
  label: String;

  /**
   * Subtitle shown below the main title, if present.
   */
  @Input()
  subtitle?: String;

  /**
   * String representing the kind of environment the application is running in.
   * Will be shown in a ribbon, top-left corner of the header.
   */
  @Input()
  environment?: String;

  /**
   * Background color for the ribbon, if present.
   */
  @Input()
  environmentColor?: String;

  /**
   * Reference to children elements projected through ng-content
   */
  @ViewChild('content', { static: true })
  ngContent: ElementRef;

  /**
   * Reference to the template which will hold navbuttons wrapping projected elements
   */
  @ViewChild('navigationButtons', { static: true, read: ViewContainerRef })
  navigationButtons: ViewContainerRef;

  @ViewChild('iconContent', { static: true })
  iconContent: ElementRef;

  private _buttonSpacing = 70;
  private _componentFactory: ComponentFactory<NavbuttonComponent>;
  private _left = 0;

  constructor(private _resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this._checkLabel();
    const element = this.ngContent.nativeElement;
    this._componentFactory = this._resolver.resolveComponentFactory(NavbuttonComponent);

    while (element.children.length > 0) {
      this._addElementToNavbar(element.children[0]);
    }
  }

  /**
   * Wrap an element inside a navbutton and add it to this components children
   * The element is shifted to the right so that it shows correctly in absolute
   * positioning.
   * @param element Element to add
   */
  private _addElementToNavbar(element: any) {
    const wrapperButton = this.navigationButtons.createComponent(
      this._componentFactory,
      0,
      undefined,
      [[element]]
    );
    wrapperButton.location.nativeElement.style.left = this._left + 'px';
    this._left +=
      element.offsetWidth + this._buttonSpacing + (wrapperButton.instance.isDropdown ? 20 : 0);
  }

  get isIconProvided() {
    return (
      this.iconContent &&
      this.iconContent.nativeElement &&
      this.iconContent.nativeElement.children.length > 0
    );
  }

  private _checkLabel() {
    if (!this.label) {
      throw new Error('You must set [label] for sbb-header.');
    }
  }
}
