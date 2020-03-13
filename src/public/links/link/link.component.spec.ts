import { ChangeDetectionStrategy, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule],
      declarations: [LinkComponent]
    }).overrideComponent(LinkComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two sbb-icon-arrow-right components', () => {
    component.icon = 'arrow';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-arrow-right'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(2);
  });

  it('should have two sbb-icon-download components', () => {
    component.icon = 'download';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-download'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(2);
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

  it('should have grey text and icon in form mode', () => {
    component.mode = 'form';
    fixture.detectChanges();

    const elementStyle = getComputedStyle(fixture.debugElement.nativeElement);

    // #666666 == rgb(102,102,102)
    expect(elementStyle.getPropertyValue('color')).toBe('rgb(102, 102, 102)');

    const icon = fixture.debugElement.query(By.css('sbb-icon-arrow-right svg'));
    expect(icon).toBeTruthy();

    const iconStyle = getComputedStyle(icon.nativeElement);

    // #666666 == rgb(102, 102, 102)
    expect(iconStyle.getPropertyValue('fill')).toBe('rgb(102, 102, 102)');
  });
});
