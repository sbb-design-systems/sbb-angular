import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { SocialLinkComponent } from './social-link.component';

describe('SocialLinkComponent', () => {
  let component: SocialLinkComponent;
  let fixture: ComponentFixture<SocialLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SocialLinkComponent],
      imports: [IconCollectionModule]
    })
      .overrideComponent(SocialLinkComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLinkComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have grey background and white icon', () => {
    component.icon = 'facebook';
    fixture.detectChanges();

    const elementStyle = getComputedStyle(fixture.debugElement.nativeElement);

    // #66666 == rgb(102,102,102)
    expect(elementStyle.getPropertyValue('background-color')).toBe('rgb(102, 102, 102)');

    const icon = fixture.debugElement.query(By.css('sbb-icon-facebook svg'));
    expect(icon).toBeTruthy();

    const iconStyle = getComputedStyle(icon.nativeElement);

    // #FFFFFF == rgb(255,255,255)
    expect(iconStyle.getPropertyValue('fill')).toBe('rgb(255, 255, 255)');
  });

  it('should have a sbb-icon-facebook component', () => {
    component.icon = 'facebook';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-facebook'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-instagram component', () => {
    component.icon = 'instagram';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-instagram'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-linkedin component', () => {
    component.icon = 'linkedin';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-linkedin'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-pinterest component', () => {
    component.icon = 'pinterest';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-pinterest'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-twitter component', () => {
    component.icon = 'twitter';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-twitter'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-xing component', () => {
    component.icon = 'xing';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-xing'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });

  it('should have a sbb-icon-youtube component', () => {
    component.icon = 'youtube';
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('sbb-icon-youtube'));
    expect(icons).toBeTruthy();
    expect(icons.length).toBe(1);
  });
});
