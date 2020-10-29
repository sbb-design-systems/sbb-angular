import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbbEsriTypesService } from '@sbb-esta/angular-maps/core';

import { SbbEsriLegend } from './esri-legend.component';

describe('SbbEsriLegend', () => {
  let component: SbbEsriLegend;
  let fixture: ComponentFixture<SbbEsriLegend>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbbEsriLegend],
      providers: [SbbEsriTypesService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriLegend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
