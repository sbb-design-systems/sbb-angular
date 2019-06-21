import { Component, DebugElement, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  IconArrowRightComponent as TestIconComponent,
  IconCollectionModule
} from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { ButtonIconDirective } from '../../../../../angular-public/src/lib/button/button/button-icon.directive';

import { ButtonComponent } from './button.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-button-test',
  template: `
    <button sbbButton [icon]="icon" [mode]="mode" [disabled]="disabled" (click)="testClick()">
      Bezeichnung
    </button>
    <ng-template #icon><sbb-icon-arrow-right></sbb-icon-arrow-right></ng-template>
  `,
  entryComponents: [TestIconComponent]
})
export class ButtonTemplateTestComponent {
  mode: string;
  disabled: boolean;

  testClick() {}
}

describe('ButtonComponent', () => {
  let component: ButtonTemplateTestComponent;
  let fixture: ComponentFixture<ButtonTemplateTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule],
      declarations: [ButtonComponent, ButtonTemplateTestComponent, ButtonIconDirective]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(ButtonTemplateTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two icons instantiated if the icon is being passed', () => {
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-arrow-right'));

    expect(icons).toBeTruthy();
    expect(icons.length).toBe(2);
  });

  describe('Alternative Primary Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'alternative';

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button.sbb-button'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
      sbbButtonIconStyle = getComputedStyle(sbbButtonIcon.nativeElement);
    });

    it('should have a grey background color of rgb(104, 104, 104)/#686868', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgb(104, 104, 104)');
    });

    it('should have a white text color', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(255, 255, 255)');
    });

    it('should the icons be white', () => {
      expect(sbbButtonIconStyle.getPropertyValue('fill')).toBe('rgb(255, 255, 255)');
    });
  });

  describe('Icon Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'icon';

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
      sbbButtonIconStyle = getComputedStyle(sbbButtonIcon.nativeElement);
    });

    it('should have a grey background color of rgb(220, 220, 220)/#DCDCDC', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgb(220, 220, 220)');
    });

    it('should the icons be grey of rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonIconStyle.getPropertyValue('fill')).toBe('rgb(68, 68, 68)');
    });
  });

  describe('Disabled Primary Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'primary';
      component.disabled = true;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button.sbb-button'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
      sbbButtonIconStyle = getComputedStyle(sbbButtonIcon.nativeElement);
    });

    it('should have a red background color of rgb(235, 0, 0)/#EB0000', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgb(235, 0, 0)');
    });

    it('should have a white text color', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(255, 255, 255)');
    });

    it('should the icons be white', () => {
      expect(sbbButtonIconStyle.getPropertyValue('fill')).toBe('rgb(255, 255, 255)');
    });

    it('should have opacity 0.4', () => {
      expect(sbbButtonStyle.getPropertyValue('opacity')).toBe('0.4');
    });
  });
});
