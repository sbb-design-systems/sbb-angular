import { Type, Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from './button.component';
import { ButtonIconDirective } from './button-icon.directive';
import { IconCommonModule } from '../../svg-icons-components';
import { IconArrowDownComponent as TestIconComponent } from '../../svg-icons-components/base/sbb-icon-arrow-down.component';

@Component({
  selector: 'sbb-button-test',
  template: '<button sbbButton [icon]="icon" [mode]="mode" [disabled]="disabled" (click)="testClick()">Bezeichnung</button>' +
            '<ng-template #icon><sbb-icon-arrow-down></sbb-icon-arrow-down></ng-template>',
  entryComponents: [TestIconComponent]
})
export class ButtonTemplateTestComponent {
  icon: Type<{}>;
  mode: string;
  disabled: boolean;

  testClick() { }
}

describe('ButtonComponent', () => {
  let component: ButtonTemplateTestComponent;
  let fixture: ComponentFixture<ButtonTemplateTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IconCommonModule
      ],
      declarations: [ButtonComponent, ButtonTemplateTestComponent, ButtonIconDirective]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonTemplateTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two icons instanciated if the icon is being passed', () => {
    component.icon = TestIconComponent;

    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-arrow-down'));

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
      component.icon = TestIconComponent;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-down'));
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
      component.icon = TestIconComponent;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-down'));
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

    it('should have a grey text of color rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(68, 68, 68)');
    });

    it('should have a grey box shadow of color rgb(168, 168, 168)/#A8A8A8', () => {
      expect(sbbButtonStyle.getPropertyValue('box-shadow')).toBe('rgb(168, 168, 168) 0px 0px 0px 1px inset');
    });

  });

  describe('Frameless Button', () => {
    let sbbButton: DebugElement;
    let sbbButtonStyle: CSSStyleDeclaration;
    let sbbButtonIcon: DebugElement;
    let sbbButtonIconStyle: CSSStyleDeclaration;

    beforeEach(() => {
      component.mode = 'frameless';
      component.icon = TestIconComponent;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIcon = fixture.debugElement.query(By.css('sbb-icon-arrow-down'));
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
           sbbButtonStyle.getPropertyValue('border-top-width')
        && sbbButtonStyle.getPropertyValue('border-right-width')
        && sbbButtonStyle.getPropertyValue('border-bottom-width')
        && sbbButtonStyle.getPropertyValue('border-left-width')
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
      component.icon = TestIconComponent;
      component.disabled = true;

      fixture.detectChanges();

      sbbButton = fixture.debugElement.query(By.css('button[sbbButton]'));
      sbbButtonStyle = getComputedStyle(sbbButton.nativeElement);
      sbbButtonIconWrapper = fixture.debugElement.query(By.css('.mod-svgsprite-icon'));
      sbbButtonIconWrapperStyle = getComputedStyle(sbbButtonIconWrapper.nativeElement);
    });

    it('should have a transparent background color', () => {
      expect(sbbButtonStyle.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
    });

    it('should have a grey text of color rgb(68, 68, 68)/#444444', () => {
      expect(sbbButtonStyle.getPropertyValue('color')).toBe('rgb(68, 68, 68)');
    });

    it('should have a grey box shadow of color rgb(168, 168, 168)/#A8A8A8', () => {
      expect(sbbButtonStyle.getPropertyValue('box-shadow')).toBe('rgb(168, 168, 168) 0px 0px 0px 1px inset');
    });

    it('should have a line-through text decoration', () => {
      expect(sbbButtonStyle.getPropertyValue('text-decoration')).toContain('line-through');
    });

    it('should not the icons be diplayed', () => {
      expect(sbbButtonIconWrapperStyle.getPropertyValue('display')).toBe('none');
    });

    it('should not be possible to invoke the testClick method when the button is disabled', () => {
      spyOn(component, 'testClick');

      sbbButton.nativeElement.click();

      expect(component.testClick).not.toHaveBeenCalled();
    });

  });

});
