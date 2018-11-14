import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SbbFieldShowcaseComponent } from './field-showcase.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from 'sbb-angular';

describe('SbbFieldShowcaseComponent', () => {

  let component: SbbFieldShowcaseComponent;
  let fixture: ComponentFixture<SbbFieldShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, FieldModule],
      declarations: [SbbFieldShowcaseComponent]
    })
    .overrideComponent(SbbFieldShowcaseComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbFieldShowcaseComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have at least 3 types of input text forms', () => {
    // first round of change detection ...
    fixture.detectChanges();
    // tslint:disable-next-line
    expect(component.types).toEqual(['1. SBB-Field without Attribute Label', '2. SBB-Field with SBB-Label, Text and Input', '3. SBB-Field with Attribute Label']);
  });

  it('form invalid when empty', () => {
     expect(component.myForm1.valid).toBeFalsy();
     expect(component.myForm2.valid).toBeFalsy();
     expect(component.myForm3.valid).toBeFalsy();
  });

  it('name1 field validity', () => {
      const name1 = component.myForm1.controls['name1'];
      const errors = name1.errors || {};
      expect(errors['required']).toBeTruthy();
  });

  it('name2 field validity', () => {
      const name2 = component.myForm2.controls['name2'];
      const errors = name2.errors || {};
      expect(errors['required']).toBeTruthy();
  });

  it('name3 field validity', () => {
      const name3 = component.myForm3.controls['name3'];
      const errors = name3.errors || {};
      expect(errors['required']).toBeTruthy();
  });

  it('name1 field validity after setting a value', () => {
    const name1 = component.myForm1.controls['name1'];
    name1.setValue('My Name');
    const errors = name1.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('name2 field validity after setting a value', () => {
   const name2 = component.myForm2.controls['name2'];
   name2.setValue('My Name');
   const errors = name2.errors || {};
   expect(errors['required']).toBeFalsy();
   expect(errors['minlength']).toBeFalsy();
  });

  it('name3 field validity after setting a value', () => {
   const name3 = component.myForm3.controls['name3'];
   name3.setValue('My Name');
   const errors = name3.errors || {};
   expect(errors['required']).toBeFalsy();
  });

});
