import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriWebMap } from './esri-web-map.component';

describe('SbbEsriWebMap', () => {
  let component: SbbEsriWebMap;
  let fixture: ComponentFixture<SbbEsriWebMap>;

  let oriConsoleWarn: any;

  beforeAll(() => {
    oriConsoleWarn = console.warn;
    console.warn = function (): void {};
  });

  afterAll(() => {
    console.warn = oriConsoleWarn;
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbEsriWebMap],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriWebMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
