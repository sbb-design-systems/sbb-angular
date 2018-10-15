import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaComponent } from './textarea.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule],
      declarations: [TextareaComponent]
    }).overrideComponent(TextareaComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
      .compileComponents();
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be required', () => {
    component.required = true;
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('.ng-invalid'));
  });

});


fdescribe('TextareaComponent digits counter', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule],
      declarations: [TextareaComponent]
    }).overrideComponent(TextareaComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    component.maxlength = 20;
    component.textContent = 'SBB';
    fixture.detectChanges();
  });

  it('should have a digits counter on the bottom right', () => {
    component.maxlength = 20;
    component.textContent = 'SBB';
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv).toBeTruthy();
  });

  it('should have a 17 value', async () => {
    component.maxlength = 20;
    component.writeValue('SBB');
    fixture.detectChanges();
    component.writeValue(component.textContent + ' ');
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv.nativeElement.textContent).toBe('Noch 16 Zeichen');

  });

  it('shoud disappear', () => {
    component.maxlength = null;
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv).toBeNull();
  });
});
