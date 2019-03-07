import {
  Component,
  AfterViewInit,
  ContentChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ViewChild,
  ElementRef
} from '@angular/core';
import { DropdownTriggerDirective, DropdownComponent, DropdownOriginDirective } from '../../dropdown/dropdown';

@Component({
  selector: 'sbb-breadcrumb-level',
  templateUrl: './breadcrumb-level.component.html',
  styleUrls: ['./breadcrumb-level.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbLevelComponent extends DropdownTriggerDirective implements AfterViewInit {

  @ContentChild(DropdownComponent) dropdown: DropdownComponent;

  @ViewChild('breadcrumbTrigger') breadcrumbTrigger: ElementRef;

  @Input() label: string;

  @HostBinding('class.sbb-breadcrumb-level')
  cssClass = true;

  panelClass = 'sbb-breadcrumb-level-panel';

  get isLast(): boolean {
    return !this.getConnectedElement().nativeElement.nextSibling;
  }


  ngAfterViewInit() {
    if (this.dropdown) {
      this.connectedTo = new DropdownOriginDirective(this.breadcrumbTrigger);
    }
  }


  /** Handles all keydown events on the select. */
  handleKeydown(event: KeyboardEvent): void {
    if (this.dropdown) {
      super.handleKeydown(event);
    }
  }

  protected getPanelWidth(): number | string {
    let scalingFactor = 1;
    if (this.viewportRuler.getViewportSize().width > 2561) {
      scalingFactor = 1.5;
    }
    if (this.viewportRuler.getViewportSize().width > 3841) {
      scalingFactor = 2;
    }
    return this.getHostWidth() + (60 * scalingFactor);
  }


}
