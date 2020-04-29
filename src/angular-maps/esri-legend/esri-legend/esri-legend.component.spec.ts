import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';

import { EsriLegendComponent } from './esri-legend.component';

describe('EsriLegendComponent', () => {
  let component: EsriLegendComponent;
  let fixture: ComponentFixture<EsriLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsriLegendComponent],
      providers: [EsriTypesService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
