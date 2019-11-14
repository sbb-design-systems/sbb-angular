import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IconCollectionModule } from '@sbb-esta/angular-icons/src/lib';

import { StatusTooltipComponent } from './status-tooltip/status-tooltip.component';
import { StatusTooltipDirective } from './status-tooltip/status-tooltip.directive';
import { StatusComponent } from './status.component';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, CommonModule, PortalModule, OverlayModule],
      declarations: [StatusComponent, StatusTooltipDirective, StatusTooltipComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exist sbb-status', () => {
    expect(component.tooltipText).toEqual('default');
  });
});
