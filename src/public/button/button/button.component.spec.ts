import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  IconArrowRightComponent as TestIconComponent,
  IconCollectionModule
} from '@sbb-esta/angular-icons';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule],
      declarations: [ButtonComponent, ButtonTemplateTestComponent]
    }).compileComponents();
  }));

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

  describe('Primary Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'primary';

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
  });

  describe('Secondary Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'secondary';

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
      sbbButtonIconStyle = getComputedStyle(sbbButtonIcon.nativeElement);
    });

    it('should have a grey background color of rgb(220, 220, 220)/#DCDCDC', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgb(220, 220, 220)');
    });

    it('should have a grey text color of rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(68, 68, 68)');
    });

    it('should the icons be grey of rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonIconStyle.getPropertyValue('fill')).toBe('rgb(68, 68, 68)');
    });
  });

  describe('Ghost Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'ghost';

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
    });

    it('should have a transparent background color', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
    });

    it('should have a grey text of color rgb(102, 102, 102)/#666666', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(102, 102, 102)');
    });

    it('should have a grey border color of rgb(168, 168, 168)/#A8A8A8', () => {
      expect(
        sbbButtonStyle.getPropertyValue('border-top-color') &&
          sbbButtonStyle.getPropertyValue('border-right-color') &&
          sbbButtonStyle.getPropertyValue('border-bottom-color') &&
          sbbButtonStyle.getPropertyValue('border-left-color')
      ).toBe('rgb(168, 168, 168)');
    });
  });

  describe('Frameless Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'frameless';

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
      sbbButtonIconStyle = getComputedStyle(sbbButtonIcon.nativeElement);
    });

    it('should have a transparent background', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
    });

    it('should have a grey text color of rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(68, 68, 68)');
    });

    it('should the icons be grey of rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonIconStyle.getPropertyValue('fill')).toBe('rgb(68, 68, 68)');
    });

    it('should not have a box shadow', () => {
      expect(sbbButtonStyle.getPropertyValue('box-shadow')).toBe('none');
    });

    it('should not have borders', () => {
      expect(
        sbbButtonStyle.getPropertyValue('border-top-width') &&
          sbbButtonStyle.getPropertyValue('border-right-width') &&
          sbbButtonStyle.getPropertyValue('border-bottom-width') &&
          sbbButtonStyle.getPropertyValue('border-left-width')
      ).toBe('0px');
    });
  });

  describe('Disabled Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIconWrapper: DebugElement;
    let sbbButtonIconWrapperStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'primary';
      component.disabled = true;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIconWrapper = fixture.debugElement.query(By.css('.sbb-svgsprite-icon'));
      sbbButtonIconWrapperStyle = getComputedStyle(sbbButtonIconWrapper.nativeElement);
    });

    it('should have a transparent background color', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
    });

    it('should have a grey text of color rgb(102, 102, 102)/#666666', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(102, 102, 102)');
    });

    it('should have a grey border color of rgb(151, 151, 151)/#979797', () => {
      expect(
        sbbButtonStyle.getPropertyValue('border-top-color') &&
          sbbButtonStyle.getPropertyValue('border-right-color') &&
          sbbButtonStyle.getPropertyValue('border-bottom-color') &&
          sbbButtonStyle.getPropertyValue('border-left-color')
      ).toBe('rgb(151, 151, 151)');
    });

    it('should have a line-through text decoration', () => {
      expect(sbbButtonStyle.getPropertyValue('text-decoration')).toContain('line-through');
    });

    it('should not the icons be displayed', () => {
      expect(sbbButtonIconWrapperStyle.getPropertyValue('display')).toBe('none');
    });

    it('should not be possible to invoke the testClick method when the button is disabled', () => {
      spyOn(component, 'testClick');

      sbbButton.nativeElement.click();

      expect(component.testClick).not.toHaveBeenCalled();
    });
  });
});
