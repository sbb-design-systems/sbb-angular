import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';

import { GraphicService } from '../../../core/src/graphic/graphic.service';
import { HitTestService } from '../../../core/src/hit-test/hit-test.service';

import { EsriWebMapComponent } from './esri-web-map.component';

describe('EsriWebMapComponent', () => {
  let component: EsriWebMapComponent;
  let fixture: ComponentFixture<EsriWebMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsriWebMapComponent],
      providers: [EsriTypesService, HitTestService, GraphicService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriWebMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
