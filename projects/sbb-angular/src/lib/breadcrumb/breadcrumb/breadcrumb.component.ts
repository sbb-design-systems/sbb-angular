import {
  Component,
  AfterViewInit,
  ContentChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  EventEmitter
} from '@angular/core';

import { DropdownTriggerDirective } from '../../dropdown/dropdown-trigger.directive';
import { DropdownOriginDirective } from '../../dropdown/dropdown-origin.directive';
import { DropdownComponent } from '../../dropdown/dropdown/dropdown.component';

const DESKTOP_4K_BREAKPOINT = 2561;
const DESKTOP_5K_BREAKPOINT = 3841;
const BREADCRUMB_LEVEL_OFFSET = 60;
const SCALING_FACTOR_4K = 1.5;
const SCALING_FACTOR_5K = 2;

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent extends DropdownTriggerDirective implements AfterViewInit {

  @ContentChild(DropdownComponent) dropdown: DropdownComponent;

  @ViewChild('breadcrumbTrigger') breadcrumbTrigger: ElementRef;

  @HostBinding('class.sbb-breadcrumb')
  cssClass = true;

  panelClass = 'sbb-breadcrumb-panel';

  get isFirst(): boolean {
    return !this.getConnectedElement().nativeElement.previousSibling;
  }

  expandEvent: EventEmitter<any> = new EventEmitter<any>();


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

  expand($event: any) {
    this.expandEvent.emit();
    $event.stopPropagation();
  }

  protected getPanelWidth(): number | string {
    let scalingFactor = 1;
    if (this.viewportRuler.getViewportSize().width > DESKTOP_4K_BREAKPOINT) {
      scalingFactor = SCALING_FACTOR_4K;
    }
    if (this.viewportRuler.getViewportSize().width > DESKTOP_5K_BREAKPOINT) {
      scalingFactor = SCALING_FACTOR_5K;
    }
    return this.getHostWidth() + (BREADCRUMB_LEVEL_OFFSET * scalingFactor);
  }

  protected attachOverlay(): void {
    if (this.dropdown) {
      super.attachOverlay();
    }
  }

}
