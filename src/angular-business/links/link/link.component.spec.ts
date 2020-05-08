import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LinksModule } from '../links.module';

@Component({
  selector: 'sbb-test-link',
  template: `
    <a sbbLink [mode]="mode" [icon]="icon">test</a>
  `
})
class TestLinkComponent {
  mode: 'normal' | 'stretch' = 'normal';
  icon: 'arrow' | 'download' = 'arrow';
}

describe('LinkComponent', () => {
  let component: TestLinkComponent;
  let fixture: ComponentFixture<TestLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestLinkComponent],
      imports: [LinksModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have one sbb-icon-arrow-right components', () => {
    component.icon = 'arrow';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-arrow-right'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have one sbb-icon-download components', () => {
    component.icon = 'download';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-download'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-download components in stretch mode', () => {
    component.icon = 'download';
    component.mode = 'stretch';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-download'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-arrow-right components in stretch mode', () => {
    component.mode = 'stretch';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-arrow-right'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have black color', () => {
    fixture.detectChanges();

    const elementStyle = getComputedStyle(fixture.debugElement.query(By.css('a')).nativeElement);

    expect(elementStyle.getPropertyValue('color')).toBe('rgb(0, 0, 0)');

    const icon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
    expect(icon).toBeTruthy();

    const iconStyle = getComputedStyle(icon.nativeElement);

    expect(iconStyle.getPropertyValue('fill')).toBe('rgb(0, 0, 0)');
  });
});
