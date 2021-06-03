import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'sbb-date-format',
  template: `
    <span>{{ now | date }}</span>
    <span>{{ now | date: 'shortDate' }}</span>
    <span>{{ now | date: 'short' }}</span>
  `,
})
class DateFormat {
  now = new Date(2020, 0, 1, 0, 0, 0);
}

describe('i18n sbb patch', () => {
  let component: DateFormat;
  let fixture: ComponentFixture<DateFormat>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DateFormat],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFormat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component test is created', () => {
    const [datetime, shortDate, shortDatetime] = fixture.debugElement
      .queryAll(By.css('span'))
      .map((e) => e.nativeElement.textContent);
    expect(datetime).toEqual('01.01.2020');
    expect(shortDate).toEqual('01.01.2020');
    expect(shortDatetime).toEqual('01.01.2020 00:00');
  });
});
