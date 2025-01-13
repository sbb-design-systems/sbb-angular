import { ApplicationRef, Component, Directive } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createMouseEvent, dispatchEvent, switchToLean } from '@sbb-esta/angular/core/testing';
import { SbbIcon, SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbButton, SbbButtonModule } from './index';

describe('SbbButton', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
    });
  }));

  // General button tests
  it('should not clear previous defined classes', () => {
    const fixture = TestBed.createComponent(ButtonTest);
    const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;

    buttonDebugElement.nativeElement.classList.add('custom-class');

    fixture.detectChanges();

    expect(buttonDebugElement.nativeElement.classList.contains('sbb-button-base')).toBeTrue();
    expect(buttonDebugElement.nativeElement.classList.contains('sbb-icon-button')).toBeFalse();
    expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBeTrue();
  });

  it('should be able to focus button with a specific focus origin', () => {
    const fixture = TestBed.createComponent(ButtonTest);
    fixture.detectChanges();
    const buttonDebugEl = fixture.debugElement.query(By.css('button'));
    const buttonInstance = buttonDebugEl.componentInstance as SbbButton;

    expect(buttonDebugEl.nativeElement.classList).not.toContain('cdk-focused');

    buttonInstance.focus('touch');

    expect(buttonDebugEl.nativeElement.classList).toContain('cdk-focused');
    expect(buttonDebugEl.nativeElement.classList).toContain('cdk-touch-focused');
  });

  it('should not change focus origin if origin not specified', () => {
    const fixture = TestBed.createComponent(ButtonTest);
    fixture.detectChanges();

    const primaryButtonDebugEl = fixture.debugElement.query(By.css('button[sbb-button]'))!;
    const primaryButtonInstance = primaryButtonDebugEl.componentInstance as SbbButton;
    primaryButtonInstance.focus('mouse');

    const secondaryButtonDebugEl = fixture.debugElement.query(
      By.css('button[sbb-secondary-button]'),
    )!;
    const secondaryButtonInstance = secondaryButtonDebugEl.componentInstance as SbbButton;

    secondaryButtonInstance.focus();

    expect(secondaryButtonDebugEl.nativeElement.classList).toContain('cdk-focused');
    expect(secondaryButtonDebugEl.nativeElement.classList).toContain('cdk-mouse-focused');
  });

  // Regular button tests
  describe('button[sbb-button]', () => {
    it('should handle a click on the button', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;

      buttonDebugElement.nativeElement.click();
      expect(testComponent.clickCount).toBe(1);
    });

    it('should not increment if disabled', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();

      expect(testComponent.clickCount).toBe(0);
    });

    it('should disable the native button element', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const buttonNativeElement = fixture.nativeElement.querySelector('button');
      expect(buttonNativeElement.disabled)
        .withContext('Expected button not to be disabled')
        .toBeFalsy();

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      expect(buttonNativeElement.disabled)
        .withContext('Expected button to be disabled')
        .toBeTruthy();
    });

    describe('standard', () => {
      it('should have two indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(By.css('button[sbb-button] sbb-icon'));
        expect(svgIcons.length).toEqual(2);
      });

      it('should have custom indicator icons if specified', () => {
        const fixture = TestBed.createComponent(ButtonWithCustomSvgIconTest);
        fixture.detectChanges();
        const svgIconElements = fixture.debugElement.queryAll(
          By.css('button[sbb-button] sbb-icon'),
        );
        const icons: SbbIcon[] = svgIconElements.map((i) => i.componentInstance);
        expect(fixture.nativeElement.classList.contains('sbb-icon-button')).toBeFalse();
        expect(icons.every((i) => i.svgIcon === fixture.componentInstance.svgIcon)).toBeTrue();
      });

      it('should have a red background color of rgb(235, 0, 0)/#EB0000', () => {
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgb(235, 0, 0)');
      });

      it('should have a white text color', () => {
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('color')).toBe('rgb(255, 255, 255)');
      });

      describe('disabled', () => {
        it('should have a transparent background color', () => {
          const fixture = TestBed.createComponent(ButtonTest);
          fixture.componentInstance.isDisabled = true;
          fixture.detectChanges();
          const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
          const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
          expect(buttonStyles.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
        });

        it('should have a grey text of color rgb(104, 104, 104)/#686868', () => {
          const fixture = TestBed.createComponent(ButtonTest);
          fixture.componentInstance.isDisabled = true;
          fixture.detectChanges();
          const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
          const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
          expect(buttonStyles.getPropertyValue('color')).toBe('rgb(104, 104, 104)');
        });

        it('should have a grey border color of rgb(168, 168, 168)/#A8A8A8', () => {
          const fixture = TestBed.createComponent(ButtonTest);
          fixture.componentInstance.isDisabled = true;
          fixture.detectChanges();
          const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
          const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
          expect(
            buttonStyles.getPropertyValue('border-top-color') &&
              buttonStyles.getPropertyValue('border-right-color') &&
              buttonStyles.getPropertyValue('border-bottom-color') &&
              buttonStyles.getPropertyValue('border-left-color'),
          ).toBe('rgb(168, 168, 168)');
        });

        it('should have a line-through text decoration', () => {
          const fixture = TestBed.createComponent(ButtonTest);
          fixture.componentInstance.isDisabled = true;
          fixture.detectChanges();
          const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
          const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
          expect(buttonStyles.getPropertyValue('text-decoration')).toContain('line-through');
        });

        it('should not display the icons', () => {
          const fixture = TestBed.createComponent(ButtonTest);
          fixture.componentInstance.isDisabled = true;
          fixture.detectChanges();
          const [leftIcon, rightIcon] = fixture.debugElement.queryAll(
            By.css('button[sbb-button] sbb-icon'),
          );
          expect(getComputedStyle(leftIcon.nativeElement).getPropertyValue('opacity')).toEqual('0');
          expect(getComputedStyle(rightIcon.nativeElement).getPropertyValue('opacity')).toEqual(
            '0',
          );
        });
      });
    });

    describe('lean', () => {
      switchToLean();

      it('should have no indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(By.css('button[sbb-button] sbb-icon'));
        expect(svgIcons.length).toEqual(0);
      });

      it('disabled should have a red background color of rgb(235, 0, 0, 0.4)/#EB0000', () => {
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.componentInstance.isDisabled = true;
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgba(235, 0, 0, 0.4)');
      });

      it('disabled should have a white text color with opacity', () => {
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.componentInstance.isDisabled = true;
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('color')).toBe('rgba(255, 255, 255, 0.5)');
      });
    });
  });

  // Anchor button tests
  describe('a[sbb-button]', () => {
    it('should not redirect if disabled', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'))!;

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();
    });

    it('should remove tabindex if disabled', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'))!;
      expect(buttonDebugElement.nativeElement.hasAttribute('tabindex')).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should add aria-disabled attribute if disabled', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'))!;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('false');

      testComponent.isDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not add aria-disabled attribute if disabled is false', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'))!;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled'))
        .withContext('Expect aria-disabled="false"')
        .toBe('false');
      expect(buttonDebugElement.nativeElement.getAttribute('disabled'))
        .withContext('Expect disabled="false"')
        .toBeNull();

      testComponent.isDisabled = false;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled'))
        .withContext('Expect no aria-disabled')
        .toBe('false');
      expect(buttonDebugElement.nativeElement.getAttribute('disabled'))
        .withContext('Expect no disabled')
        .toBeNull();
    });

    it('should be able to set a custom tabindex', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonElement = fixture.debugElement.query(By.css('a'))!.nativeElement;

      fixture.componentInstance.tabIndex = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(buttonElement.getAttribute('tabindex'))
        .withContext('Expected custom tabindex to be set')
        .toBe('3');

      testComponent.isDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(buttonElement.getAttribute('tabindex'))
        .withContext('Expected custom tabindex to be overwritten when disabled.')
        .toBe('-1');
    });

    it('should not set a default tabindex on enabled links', () => {
      const fixture = TestBed.createComponent(ButtonTest);
      const buttonElement = fixture.debugElement.query(By.css('a'))!.nativeElement;
      fixture.detectChanges();

      expect(buttonElement.hasAttribute('tabindex')).toBe(false);
    });

    describe('change detection behavior', () => {
      it('should not run change detection for disabled anchor but should prevent the default behavior and stop event propagation', () => {
        const appRef = TestBed.inject(ApplicationRef);
        const fixture = TestBed.createComponent(ButtonTest);
        fixture.componentInstance.isDisabled = true;
        fixture.detectChanges();
        const anchorElement = fixture.debugElement.query(By.css('a'))!.nativeElement;

        spyOn(appRef, 'tick');

        const event = createMouseEvent('click');
        spyOn(event, 'preventDefault').and.callThrough();
        spyOn(event, 'stopImmediatePropagation').and.callThrough();

        dispatchEvent(anchorElement, event);

        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopImmediatePropagation).toHaveBeenCalled();
      });
    });
  });

  describe('button[sbb-alt-button]', () => {
    describe('lean', () => {
      switchToLean();

      it('should have no indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonAltTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(By.css('button[sbb-alt-button] sbb-icon'));
        expect(svgIcons.length).toEqual(0);
      });

      it('should have a grey background color of rgb(104, 104, 104)/#686868', () => {
        const fixture = TestBed.createComponent(ButtonAltTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgb(104, 104, 104)');
      });

      it('should have a white text color', () => {
        const fixture = TestBed.createComponent(ButtonAltTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('color')).toBe('rgb(255, 255, 255)');
      });
    });
  });

  describe('button[sbb-secondary-button]', () => {
    describe('standard', () => {
      it('should have two indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonSecondaryTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(
          By.css('button[sbb-secondary-button] sbb-icon'),
        );
        expect(svgIcons.length).toEqual(2);
      });

      it('should have a grey background color of rgb(220, 220, 220)/#DCDCDC', () => {
        const fixture = TestBed.createComponent(ButtonSecondaryTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgb(220, 220, 220)');
      });

      it('should have a grey text color of rgb(68, 68, 68)/#444444', () => {
        const fixture = TestBed.createComponent(ButtonSecondaryTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('color')).toBe('rgb(68, 68, 68)');
      });
    });

    describe('lean', () => {
      switchToLean();

      it('should have no indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonSecondaryTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(
          By.css('button[sbb-secondary-button] sbb-icon'),
        );
        expect(svgIcons.length).toEqual(0);
      });
    });
  });

  describe('button[sbb-ghost-button]', () => {
    describe('standard', () => {
      it('should have no indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonGhostTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(By.css('button[sbb-ghost-button] sbb-icon'));
        expect(svgIcons.length).toEqual(0);
      });

      it('should have a transparent background color', () => {
        const fixture = TestBed.createComponent(ButtonGhostTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
      });

      it('should have a grey text of color rgb(104, 104, 104)/#686868', () => {
        const fixture = TestBed.createComponent(ButtonGhostTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('color')).toBe('rgb(104, 104, 104)');
      });

      it('should have a grey border color of rgb(168, 168, 168)/#A8A8A8', () => {
        const fixture = TestBed.createComponent(ButtonGhostTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(
          buttonStyles.getPropertyValue('border-top-color') &&
            buttonStyles.getPropertyValue('border-right-color') &&
            buttonStyles.getPropertyValue('border-bottom-color') &&
            buttonStyles.getPropertyValue('border-left-color'),
        ).toBe('rgb(168, 168, 168)');
      });
    });

    describe('lean', () => {
      switchToLean();

      it('should have no indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonGhostTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(By.css('button[sbb-ghost-button] sbb-icon'));
        expect(svgIcons.length).toEqual(0);
      });
    });
  });

  describe('button[.sbb-icon-button]', () => {
    describe('lean', () => {
      switchToLean();

      it('should have a grey background color of rgb(220, 220, 220)/#DCDCDC', () => {
        const fixture = TestBed.createComponent(ButtonIconTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonDebugElement.nativeElement.classList.contains('sbb-icon-button')).toBeTrue();
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgb(220, 220, 220)');
      });

      it('should add the `sbb-icon-button` class if only an icon is contained', () => {
        const fixture = TestBed.createComponent(ButtonIconTestMultiple);
        fixture.detectChanges();
        const nonIconButtonElements = fixture.debugElement.queryAll(
          By.css('p.non-icon-buttons > :is(a, button)'),
        )!;
        const iconButtonElements = fixture.debugElement.queryAll(
          By.css('p.icon-buttons > :is(a, button)'),
        )!;

        expect(nonIconButtonElements.length).toEqual(10);
        expect(iconButtonElements.length).toEqual(8);

        expect(
          nonIconButtonElements.every(
            (btn) => !btn.nativeElement.classList.contains('sbb-icon-button'),
          ),
        )
          .withContext('Expected non-icon-buttons not to habe an sbb-icon-button class')
          .toBeTrue();

        expect(
          iconButtonElements.every((btn) =>
            btn.nativeElement.classList.contains('sbb-icon-button'),
          ),
        )
          .withContext('Expected icon-buttons to have an sbb-icon-button class')
          .toBeTrue();
      });
    });
  });

  describe('button[sbb-frameless-button]', () => {
    describe('standard', () => {
      it('should have two indicator icons', () => {
        const fixture = TestBed.createComponent(ButtonFramelessTest);
        fixture.detectChanges();
        const svgIcons = fixture.debugElement.queryAll(
          By.css('button[sbb-frameless-button] sbb-icon'),
        );
        expect(svgIcons.length).toEqual(2);
      });

      it('should have a transparent background', () => {
        const fixture = TestBed.createComponent(ButtonFramelessTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('background-color')).toBe('rgba(0, 0, 0, 0)');
      });

      it('should have a grey text color of rgb(68, 68, 68)/#444444', () => {
        const fixture = TestBed.createComponent(ButtonFramelessTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('color')).toBe('rgb(68, 68, 68)');
      });

      it('should not have a box shadow', () => {
        const fixture = TestBed.createComponent(ButtonFramelessTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(buttonStyles.getPropertyValue('box-shadow')).toBe('none');
      });

      it('should not have borders', () => {
        const fixture = TestBed.createComponent(ButtonFramelessTest);
        fixture.detectChanges();
        const buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
        const buttonStyles = getComputedStyle(buttonDebugElement.nativeElement);
        expect(
          buttonStyles.getPropertyValue('border-top-width') &&
            buttonStyles.getPropertyValue('border-right-width') &&
            buttonStyles.getPropertyValue('border-bottom-width') &&
            buttonStyles.getPropertyValue('border-left-width'),
        ).toBe('0px');
      });
    });
  });

  describe('[sbb-link]', () => {
    describe('standard', () => {
      it('should have two indicator icons', () => {
        const fixture = TestBed.createComponent(LinkTest);
        fixture.detectChanges();
        const buttonSvgIcons = fixture.debugElement.queryAll(By.css('button[sbb-link] sbb-icon'));
        expect(buttonSvgIcons.length).toEqual(2);
        const aSvgIcons = fixture.debugElement.queryAll(By.css('a[sbb-link] sbb-icon'));
        expect(aSvgIcons.length).toEqual(2);
      });
    });

    describe('lean', () => {
      switchToLean();

      it('should have one indicator icon', () => {
        const fixture = TestBed.createComponent(LinkTest);
        fixture.detectChanges();
        const buttonSvgIcons = fixture.debugElement.queryAll(By.css('button[sbb-link] sbb-icon'));
        expect(buttonSvgIcons.length).toEqual(1);
        const aSvgIcons = fixture.debugElement.queryAll(By.css('a[sbb-link] sbb-icon'));
        expect(aSvgIcons.length).toEqual(1);
      });
    });
  });
});

@Directive()
class ButtonTestBase {
  clickCount: number = 0;
  isDisabled: boolean = false;
  tabIndex: number;

  increment() {
    this.clickCount++;
  }
}

/** Test component that contains an SbbButton. */
@Component({
  selector: 'button-test',
  template: `
    <button
      [tabIndex]="tabIndex"
      sbb-button
      type="button"
      (click)="increment()"
      [disabled]="isDisabled"
    >
      Go
    </button>
    <a [tabIndex]="tabIndex" href="http://www.google.com" sbb-button [disabled]="isDisabled">
      Link
    </a>
    <button sbb-secondary-button type="button" (click)="increment()" [disabled]="isDisabled">
      Go
    </button>
  `,
  imports: [SbbButtonModule],
})
class ButtonTest extends ButtonTestBase {}

@Component({
  selector: 'button-test',
  template: `
    <button
      [tabIndex]="tabIndex"
      sbb-button
      type="button"
      (click)="increment()"
      [disabled]="isDisabled"
      [svgIcon]="svgIcon"
    >
      Go
    </button>
  `,
  imports: [SbbButtonModule],
})
class ButtonWithCustomSvgIconTest extends ButtonTestBase {
  svgIcon = 'example';
}

@Component({
  selector: 'button-primary-alt-test',
  template: `
    <button sbb-alt-button type="button" (click)="increment()" [disabled]="isDisabled">Go</button>
  `,
  imports: [SbbButtonModule],
})
class ButtonAltTest extends ButtonTestBase {}

@Component({
  selector: 'button-secondary-test',
  template: `
    <button sbb-secondary-button type="button" (click)="increment()" [disabled]="isDisabled">
      Go
    </button>
  `,
  imports: [SbbButtonModule],
})
class ButtonSecondaryTest extends ButtonTestBase {}

@Component({
  selector: 'button-ghost-test',
  template: `
    <button sbb-ghost-button type="button" (click)="increment()" [disabled]="isDisabled">Go</button>
  `,
  imports: [SbbButtonModule],
})
class ButtonGhostTest extends ButtonTestBase {}

@Component({
  selector: 'button-icon-test',
  template: `
    <button sbb-secondary-button type="button" (click)="increment()" [disabled]="isDisabled">
      <sbb-icon svgIcon="example"></sbb-icon>
    </button>
  `,
  imports: [SbbButtonModule, SbbIconModule],
})
class ButtonIconTest extends ButtonTestBase {}

@Component({
  selector: 'button-icon-test-multiple',
  template: `
    <button sbb-secondary-button type="button"><sbb-icon svgIcon="example"></sbb-icon></button>
    <p class="icon-buttons">
      <!-- Buttons that should get an sbb-icon-button class -->
      <a sbb-button type="button"><sbb-icon svgIcon="example"></sbb-icon></a>
      <a sbb-alt-button type="button"><sbb-icon svgIcon="example"></sbb-icon></a>
      <a sbb-secondary-button type="button"><sbb-icon svgIcon="example"></sbb-icon></a>
      <a sbb-ghost-button type="button"><sbb-icon svgIcon="example"></sbb-icon></a>
      <button sbb-button type="button"><sbb-icon svgIcon="example"></sbb-icon></button>
      <button sbb-alt-button type="button"><sbb-icon svgIcon="example"></sbb-icon></button>
      <button sbb-secondary-button type="button"><sbb-icon svgIcon="example"></sbb-icon></button>
      <button sbb-ghost-button type="button"><sbb-icon svgIcon="example"></sbb-icon></button>
    </p>

    <p class="non-icon-buttons">
      <!-- Buttons that should not get an sbb-icon-button class -->
      <!-- ... sbb-link and sbb-frameless-button are not valid for icon buttons -->
      <button type="button" sbb-frameless-button>Frameless</button>
      <a href="http://www.google.com" sbb-link>Link</a>

      <!-- ... no icon button because there's text inside the button -->
      <a sbb-button type="button"><sbb-icon svgIcon="example">Test</sbb-icon></a>
      <a sbb-alt-button type="button">Test<sbb-icon svgIcon="example"></sbb-icon></a>
      <a sbb-secondary-button type="button">Test</a>
      <a sbb-ghost-button type="button"><sbb-icon svgIcon="example">Test</sbb-icon></a>
      <button sbb-button type="button">Test</button>
      <button sbb-alt-button type="button">Test</button>
      <button sbb-secondary-button type="button">
        <sbb-icon svgIcon="example"></sbb-icon>Test
      </button>
      <button sbb-ghost-button type="button">Test</button>
    </p>
  `,
  imports: [SbbButtonModule, SbbIconModule],
})
class ButtonIconTestMultiple extends ButtonTestBase {}

@Component({
  selector: 'button-frameless-test',
  template: `
    <button sbb-frameless-button type="button" (click)="increment()" [disabled]="isDisabled">
      Go
    </button>
  `,
  imports: [SbbButtonModule],
})
class ButtonFramelessTest extends ButtonTestBase {}

@Component({
  selector: 'link-test',
  template: `
    <button sbb-link type="button" (click)="increment()" [disabled]="isDisabled">Go</button>
    <a href="http://www.google.com" sbb-link [disabled]="isDisabled"> Link </a>
  `,
  imports: [SbbButtonModule],
})
class LinkTest extends ButtonTestBase {}
