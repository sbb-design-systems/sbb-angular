import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';
import { GraphicService, HitTestService } from '@sbb-esta/angular-maps/core';

import { EsriWebSceneComponent } from './esri-web-scene/esri-web-scene.component';

describe('EsriWebSceneComponent', () => {
  let component: EsriWebSceneComponent;
  let fixture: ComponentFixture<EsriWebSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsriWebSceneComponent],
      providers: [EsriTypesService, GraphicService, HitTestService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriWebSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
