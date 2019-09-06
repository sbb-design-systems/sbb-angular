import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'sbb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit {
  /** @docs-private */
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

  /**
   * Reference to icon, if given through projection.
   */
  @ViewChild('iconContent', { static: true })
  iconContent: ElementRef;

  /**
   * Distance between navigation buttons, handled through code.
   */
  buttonSpacing = 70;

  /** @docs-private */
  private _left = 0;

  ngOnInit() {
    this._checkLabel();
  }

  ngAfterViewInit() {
    // Absolute positioning of buttons so that they're all 70px apart and won't
    // move when one is expanded due to dropdowns, is decided here
    const element = this.ngContent.nativeElement;
    for (let k = 0; k < element.children.length; k++) {
      const child = element.children[k];
      child.style.left = this._left + 'px';
      this._left += child.clientWidth + this.buttonSpacing;
    }
  }

  /**
   * Validates required inputs.
   */
  private _checkLabel() {
    if (!this.label) {
      throw new Error('You must set [label] for sbb-header.');
    }
  }
}
