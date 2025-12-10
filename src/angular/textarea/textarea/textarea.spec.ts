import { Component, DebugElement, provideNgReflectAttributes } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  clearElement,
  dispatchFakeEvent,
  dispatchMouseEvent,
  typeInElement,
} from '@sbb-esta/angular/core/testing';
import { SbbError, SbbFormFieldModule } from '@sbb-esta/angular/form-field';

import { SbbTextareaModule } from '../textarea.module';

import { SbbTextarea } from './textarea';

@Component({
  selector: 'sbb-textarea-test',
  template: `
    <sbb-textarea
      [(ngModel)]="model"
      [minlength]="minlength"
      [maxlength]="maxlength"
      [required]="required"
      [readonly]="readonly"
      [disabled]="disabled"
    ></sbb-textarea>
  `,
  imports: [SbbTextareaModule, FormsModule],
})
class TextareaTestComponent {
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  minlength: number;
  maxlength: number;
  model: string;
}

@Component({
  selector: 'sbb-textarea-sbb-form-field',
  template: `
    <form [formGroup]="form">
      <sbb-form-field label="Textarea">
        <sbb-textarea formControlName="textarea" [maxlength]="200" [minlength]="20"></sbb-textarea>
        @if (form.get('textarea')?.errors?.['minlength']) {
          <sbb-error>A length of 20 chars is required!</sbb-error>
        }
      </sbb-form-field>
    </form>
  `,
  imports: [SbbTextareaModule, ReactiveFormsModule, FormsModule, SbbFormFieldModule],
})
class TextareaSbbFieldTestComponent {
  form: FormGroup = new FormGroup({
    textarea: new FormControl('SBB'),
  });
}

describe('SbbTextarea', () => {
  let component: SbbTextarea;
  let fixture: ComponentFixture<SbbTextarea>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SbbTextarea behaviour', () => {
  let component: TextareaTestComponent;
  let fixture: ComponentFixture<TextareaTestComponent>;
  let innerComponent: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgReflectAttributes()],
    });
    fixture = TestBed.createComponent(TextareaTestComponent);
    component = fixture.componentInstance;
    innerComponent = fixture.debugElement.query(By.directive(SbbTextarea));
    fixture.detectChanges();
  });

  it('should be required', () => {
    component.required = true;
    const textarea = innerComponent.query(By.css('textarea'));
    textarea.nativeElement.focus();
    textarea.nativeElement.blur();
    fixture.detectChanges();
    expect(
      innerComponent.classes['ng-invalid'] && innerComponent.classes['ng-touched'],
    ).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.ng-invalid'))
        .borderTopColor,
    ).toBe('rgb(235, 0, 0)');
  });

  it('should be readonly attribute', () => {
    component.readonly = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(innerComponent.attributes['ng-reflect-readonly']).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('[readonly]')).toBeTruthy();
    expect(
      fixture.debugElement.nativeElement.querySelector('textarea').getAttribute('placeholder'),
    ).toBe('-');
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(innerComponent.attributes['ng-reflect-disabled']).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('.sbb-disabled')).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.sbb-disabled'))
        .borderTopColor,
    ).toBe('rgb(210, 210, 210)');
  });

  it('should have a min length attribute', () => {
    component.minlength = 20;
    fixture.changeDetectorRef.markForCheck();
    const textarea = innerComponent.query(
      (e) => e.nativeElement.nodeName.toLowerCase() === 'textarea',
    );
    textarea.nativeElement.focus();
    typeInElement(textarea.nativeElement, 'SBB');
    textarea.nativeElement.blur();
    fixture.detectChanges();
    expect(innerComponent.attributes['minlength']).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('.ng-invalid')).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.ng-invalid'))
        .borderTopColor,
    ).toBe('rgb(235, 0, 0)');
  });

  // See https://github.com/sbb-design-systems/sbb-angular/issues/106
  it('should update the inner value twice', async () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    typeInElement(textarea, 'test1');
    fixture.detectChanges();
    expect(component.model).toEqual('test1');
    component.model = 'test2';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(textarea.value).toEqual('test2');
    clearElement(textarea);
    typeInElement(textarea, 'test3');
    fixture.detectChanges();
    expect(component.model).toEqual('test3');
    component.model = 'test4';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(textarea.value).toEqual('test4');
  });

  it('should focus textarea when clicking on host', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    spyOn(textarea, 'focus');

    expect(textarea.focus).not.toHaveBeenCalled();

    dispatchMouseEvent(innerComponent.nativeElement, 'click');
    fixture.detectChanges();

    expect(textarea.focus).toHaveBeenCalled();
  });

  it('should focus textarea when host was focused', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    spyOn(textarea, 'focus');

    expect(textarea.focus).not.toHaveBeenCalled();

    dispatchMouseEvent(innerComponent.nativeElement, 'focus');
    fixture.detectChanges();

    expect(textarea.focus).toHaveBeenCalled();
  });

  it('should resize textarea on user input', fakeAsync(() => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    expect(getComputedStyle(textarea).height).toBe('48px');

    // When
    typeInElement(textarea, 'Text \n\n\n');
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    // Then
    const maxHeightInTest = parseInt(getComputedStyle(textarea).height, 10);
    expect(maxHeightInTest).toBeGreaterThan(48);

    // When
    textarea.value = 'Text \n\n';
    dispatchFakeEvent(textarea, 'input');
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    // Then
    expect(parseInt(getComputedStyle(textarea).height, 10)).toBeLessThan(maxHeightInTest);
  }));

  it('should resize textarea on model change', fakeAsync(() => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    expect(textarea.clientHeight).toBe(48);

    // When
    fixture.componentInstance.model = 'Text \n\n\n';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    // Then
    const maxHeightInTest = textarea.clientHeight;
    expect(maxHeightInTest).toBeGreaterThan(48);

    // When
    fixture.componentInstance.model = 'Text \n\n';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    // Then
    expect(textarea.clientHeight).toBeLessThan(maxHeightInTest);
  }));

  it('should not resize if onInput was triggered without a value change', fakeAsync(() => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    fixture.componentInstance.maxlength = 10;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    // When
    typeInElement(textarea, 'Text \n\n\n');
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    // Then
    expect(parseInt(getComputedStyle(textarea).height, 10)).toBeGreaterThan(48);

    // When
    dispatchFakeEvent(textarea, 'input');
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    // Then
    expect(parseInt(getComputedStyle(textarea).height, 10)).toBeGreaterThan(48);
  }));
});

describe('SbbTextarea digits counter', () => {
  let component: SbbTextarea;
  let fixture: ComponentFixture<SbbTextarea>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbTextarea);
    component = fixture.componentInstance;
    component.maxlength = 20;
    component.value = 'SBB';
  });

  it('should appear on the bottom right', () => {
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv).toBeTruthy();
  });

  it('should have a 16 value', () => {
    component.writeValue(component.value + ' ');
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv.nativeElement.textContent.trim()).toBe('16 characters remaining');
  });

  it('should disappear', () => {
    component.maxlength = null!;
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv).toBeNull();
  });
});

describe('SbbTextarea reactive forms in sbb-form-field behaviour', () => {
  let component: TextareaSbbFieldTestComponent;
  let fixture: ComponentFixture<TextareaSbbFieldTestComponent>;
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaSbbFieldTestComponent);
    component = fixture.componentInstance;
    textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
    fixture.detectChanges();
  });

  it('should forward focus when clicking sbb-form-field label', () => {
    const label = fixture.debugElement.query(By.css('label'));
    spyOn(textarea, 'focus');

    expect(textarea.focus).not.toHaveBeenCalled();
    dispatchMouseEvent(label.nativeElement, 'click');
    fixture.detectChanges();

    expect(textarea.focus).toHaveBeenCalled();
  });

  it('should display form error when entering too less chars', () => {
    textarea.focus();

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(SbbError))).toBeFalsy();

    dispatchFakeEvent(textarea, 'blur');

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(SbbError))).toBeTruthy();
  });

  it('should be disabled', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.sbb-disabled')).toBeFalsy();

    component.form.get('textarea')!.disable();

    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.sbb-disabled')).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.sbb-disabled'))
        .borderTopColor,
    ).toBe('rgb(210, 210, 210)');
  });

  it('should correctly update value', () => {
    expect(component.form.get('textarea')!.value).toBe('SBB');

    typeInElement(textarea, ' is cool');

    fixture.detectChanges();
    expect(component.form.get('textarea')!.value).toBe('SBB is cool');
  });
});
