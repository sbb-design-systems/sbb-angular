import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriWebScene } from './esri-web-scene.component';

describe('SbbEsriWebScene', () => {
  let component: SbbEsriWebScene;
  let fixture: ComponentFixture<SbbEsriWebScene>;

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
        declarations: [SbbEsriWebScene],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriWebScene);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
