import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaComponent } from './textarea.component';
import { TextFieldModule } from '@angular/cdk/text-field';

describe('TextAreaBasicComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule],
      declarations: [TextareaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
