import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';

import { EsriLayerListComponent } from './esri-layer-list.component';

describe('EsriLayerListComponent', () => {
  let component: EsriLayerListComponent;
  let fixture: ComponentFixture<EsriLayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsriLayerListComponent],
      providers: [EsriTypesService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriLayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
