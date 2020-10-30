import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import { SbbButton } from './button.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-button-test',
  template: `
    <button sbbButton [mode]="mode" [disabled]="disabled" (click)="testClick()">Bezeichnung</button>
  `,
})
export class ButtonTestComponent {
  mode: string;
  disabled: boolean;

  testClick() {}
}

// tslint:disable:i18n
@Component({
  selector: 'sbb-button-icon-test',
  template: `
    <button sbbButton mode="icon" [disabled]="disabled" (click)="testClick()">
      <sbb-icon svgIcon="kom:arrow-right-small"></sbb-icon>
    </button>
  `,
})
export class IconButtonTestComponent {
  mode: string;
  disabled: boolean;

  testClick() {}
}

describe('SbbButton', () => {
  let component: ButtonTestComponent;
  let fixture: ComponentFixture<ButtonTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbIconModule, SbbIconTestingModule],
        declarations: [SbbButton, ButtonTestComponent, IconButtonTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(ButtonTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Alternative Primary Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'alternative';

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button.sbb-button'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
    });

    it('should have a grey background color of rgb(104, 104, 104)/#686868', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgb(104, 104, 104)');
    });

    it('should have a white text color', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(255, 255, 255)');
    });
  });

  describe('Icon Button', () => {
    let iconFixture: ComponentFixture<IconButtonTestComponent>;
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;

    beforeEach(() => {
      iconFixture = TestBed.createComponent(IconButtonTestComponent);
      iconFixture.detectChanges();

      sbbButton = iconFixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
    });

    it('should have a grey background color of rgb(220, 220, 220)/#DCDCDC', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgb(220, 220, 220)');
    });
  });

  describe('Disabled Primary Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'primary';
      component.disabled = true;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button.sbb-button'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
    });

    it('should have a red background color of rgb(235, 0, 0, 0.4)/#EB0000', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgba(235, 0, 0, 0.4)');
    });

    it('should have a white text color with opacity', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgba(255, 255, 255, 0.5)');
    });
  });
});
