import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriPluginComponent } from './esri-plugin';

describe('EsriPluginComponent', () => {
  let component: EsriPluginComponent;
  let fixture: ComponentFixture<EsriPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsriPluginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EsriPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
