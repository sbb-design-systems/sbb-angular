import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
} from '@sbb-esta/angular/core/testing';

import { SbbOption } from './option';
import { SBB_OPTION_PARENT_COMPONENT } from './option-parent';
import { SbbOptionModule } from './option.module';

@Component({
  template: `<sbb-option [id]="id" [disabled]="disabled"></sbb-option>`,
  imports: [SbbOptionModule],
})
class BasicOption {
  disabled: boolean;
  id: string;
}

@Component({
  template: `
    <sbb-optgroup label="Group">
      <sbb-option>Option</sbb-option>
    </sbb-optgroup>
  `,
  imports: [SbbOptionModule],
})
class InsideGroup {}

describe('SbbOption component', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({});
  }));

  it('should complete the `stateChanges` stream on destroy', () => {
    const fixture = TestBed.createComponent(BasicOption);
    fixture.detectChanges();

    const optionInstance: SbbOption = fixture.debugElement.query(
      By.directive(SbbOption),
    )!.componentInstance;
    const completeSpy = jasmine.createSpy('complete spy');
    const subscription = optionInstance._stateChanges.subscribe({ complete: completeSpy });

    fixture.destroy();
    expect(completeSpy).toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should not emit to `onSelectionChange` if selecting an already-selected option', () => {
    const fixture = TestBed.createComponent(BasicOption);
    fixture.detectChanges();

    const optionInstance: SbbOption = fixture.debugElement.query(
      By.directive(SbbOption),
    )!.componentInstance;

    optionInstance.select();
    expect(optionInstance.selected).toBe(true);

    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.onSelectionChange.subscribe(spy);

    optionInstance.select();
    fixture.detectChanges();

    expect(optionInstance.selected).toBe(true);
    expect(spy).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('should not emit to `onSelectionChange` if deselecting an unselected option', () => {
    const fixture = TestBed.createComponent(BasicOption);
    fixture.detectChanges();

    const optionInstance: SbbOption = fixture.debugElement.query(
      By.directive(SbbOption),
    )!.componentInstance;

    optionInstance.deselect();
    expect(optionInstance.selected).toBe(false);

    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.onSelectionChange.subscribe(spy);

    optionInstance.deselect();
    fixture.detectChanges();

    expect(optionInstance.selected).toBe(false);
    expect(spy).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('should be able to set a custom id', () => {
    const fixture = TestBed.createComponent(BasicOption);

    fixture.componentInstance.id = 'custom-option';
    fixture.detectChanges();

    const optionInstance = fixture.debugElement.query(By.directive(SbbOption))!.componentInstance;

    expect(optionInstance.id).toBe('custom-option');
  });

  it('should select the option when pressing space', () => {
    const fixture = TestBed.createComponent(BasicOption);
    fixture.detectChanges();

    const optionDebugElement = fixture.debugElement.query(By.directive(SbbOption))!;
    const optionNativeElement: HTMLElement = optionDebugElement.nativeElement;
    const optionInstance: SbbOption = optionDebugElement.componentInstance;
    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.onSelectionChange.subscribe(spy);

    const event = dispatchKeyboardEvent(optionNativeElement, 'keydown', SPACE);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
    subscription.unsubscribe();
  });

  it('should select the option when pressing enter', () => {
    const fixture = TestBed.createComponent(BasicOption);
    fixture.detectChanges();

    const optionDebugElement = fixture.debugElement.query(By.directive(SbbOption))!;
    const optionNativeElement: HTMLElement = optionDebugElement.nativeElement;
    const optionInstance: SbbOption = optionDebugElement.componentInstance;
    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.onSelectionChange.subscribe(spy);

    const event = dispatchKeyboardEvent(optionNativeElement, 'keydown', ENTER);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
    subscription.unsubscribe();
  });

  it('should not do anything when pressing the selection keys with a modifier', () => {
    const fixture = TestBed.createComponent(BasicOption);
    fixture.detectChanges();

    const optionDebugElement = fixture.debugElement.query(By.directive(SbbOption))!;
    const optionNativeElement: HTMLElement = optionDebugElement.nativeElement;
    const optionInstance: SbbOption = optionDebugElement.componentInstance;
    const spy = jasmine.createSpy('selection change spy');
    const subscription = optionInstance.onSelectionChange.subscribe(spy);

    [ENTER, SPACE].forEach((key) => {
      const event = createKeyboardEvent('keydown', key, undefined, { shift: true });
      dispatchEvent(optionNativeElement, event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
    });

    expect(spy).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });

  describe('inside inert group', () => {
    let fixture: ComponentFixture<InsideGroup>;

    beforeEach(waitForAsync(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SBB_OPTION_PARENT_COMPONENT,
            useValue: { inertGroups: true },
          },
        ],
      });

      fixture = TestBed.createComponent(InsideGroup);
      fixture.detectChanges();
    }));

    it('should remove all accessibility-related attributes from the group', () => {
      const group: HTMLElement = fixture.nativeElement.querySelector('sbb-optgroup');
      expect(group.hasAttribute('role')).toBe(false);
      expect(group.hasAttribute('aria-disabled')).toBe(false);
      expect(group.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('should mirror the group label inside the option', () => {
      const option: HTMLElement = fixture.nativeElement.querySelector('sbb-option');
      expect(option.textContent?.trim()).toBe('Option(Group)');
    });
  });
});
