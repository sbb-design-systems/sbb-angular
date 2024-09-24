import '@angular/common/locales/global/en-CH';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import './sbb-ch-patch';

declare let $localize: any;

@Component({
  selector: 'sbb-date-format',
  template: `
    <span>{{ now | date }}</span>
    <span>{{ now | date: 'short' }}</span>
    <span>{{ now | date: 'medium' }}</span>
    <span>{{ now | date: 'long' }}</span>
    <span>{{ now | date: 'full' }}</span>
    <span>{{ now | date: 'shortDate' }}</span>
    <span>{{ now | date: 'mediumDate' }}</span>
    <span>{{ now | date: 'longDate' }}</span>
    <span>{{ now | date: 'fullDate' }}</span>
    <span>{{ now | date: 'shortTime' }}</span>
    <span>{{ now | date: 'mediumTime' }}</span>
    <span>{{ now | date: 'longTime' }}</span>
    <span>{{ now | date: 'fullTime' }}</span>
  `,
  standalone: false,
})
class DateFormat {
  now = new Date(2020, 0, 1, 0, 0, 0);
}

describe('i18n sbb patch', () => {
  let fixture: ComponentFixture<DateFormat>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DateFormat],
    }).compileComponents();
  }));

  beforeEach(() => {
    $localize.locale = 'en-CH';

    fixture = TestBed.createComponent(DateFormat);
    fixture.detectChanges();
  });

  it('should display date/time in the correct format', () => {
    const [
      defaultValue,
      short,
      medium,
      long,
      full,
      shortDate,
      mediumDate,
      longDate,
      fullDate,
      shortTime,
      mediumTime,
      longTime,
      fullTime,
    ] = fixture.debugElement.queryAll(By.css('span')).map((e) => e.nativeElement.textContent);
    expect(defaultValue).toEqual('01.01.2020');
    expect(short).toEqual('01.01.20 00:00');
    expect(medium).toEqual('01.01.2020 00:00:00');
    expect(long).toEqual('1. January 2020 at 00:00:00 GMT+0');
    expect(full).toEqual('Wednesday, 1. January 2020 at 00:00:00 GMT+00:00');
    expect(shortDate).toEqual('01.01.20');
    expect(mediumDate).toEqual('01.01.2020');
    expect(longDate).toEqual('1. January 2020');
    expect(fullDate).toEqual('Wednesday, 1. January 2020');
    expect(shortTime).toEqual('00:00');
    expect(mediumTime).toEqual('00:00:00');
    expect(longTime).toEqual('00:00:00 GMT+0');
    expect(fullTime).toEqual('00:00:00 GMT+00:00');
  });
});
