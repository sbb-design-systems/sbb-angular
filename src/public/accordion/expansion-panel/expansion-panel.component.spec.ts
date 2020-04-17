import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchKeyboardEvent } from '@sbb-esta/angular-core/testing';

import { AccordionModule, ExpansionPanelComponent } from '../public-api';

// tslint:disable:i18n
@Component({
  template: `
    <sbb-expansion-panel
      [expanded]="expanded"
      [hideToggle]="hideToggle"
      [disabled]="disabled"
      (opened)="openCallback()"
      (closed)="closeCallback()"
    >
      <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>
      <p>Some content</p>
      <button>I am a button</button>
    </sbb-expansion-panel>
  `
})
class PanelWithContentComponent {
  expanded = false;
  hideToggle = false;
  disabled = false;
  openCallback = jasmine.createSpy('openCallback');
  closeCallback = jasmine.createSpy('closeCallback');
  @ViewChild(ExpansionPanelComponent, { static: true })
  panel: ExpansionPanelComponent;
}

@Component({
  template: `
    <div *ngIf="expansionShown">
      <sbb-expansion-panel>
        <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>
      </sbb-expansion-panel>
    </div>
  `
})
class PanelWithContentInNgIfComponent {
  expansionShown = true;
  @ViewChild(ExpansionPanelComponent)
  panel: ExpansionPanelComponent;
}

@Component({
  styles: [
    `
      sbb-expansion-panel {
        margin: 13px 37px;
      }
    `
  ],
  template: `
    <sbb-expansion-panel [expanded]="expanded">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores officia, aliquam dicta
      corrupti maxime voluptate accusamus impedit atque incidunt pariatur.
    </sbb-expansion-panel>
  `
})
class PanelWithCustomMarginComponent {
  expanded = false;
}

@Component({
  template: `
    <sbb-expansion-panel [expanded]="expanded">
      <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>

      <ng-template sbbExpansionPanelContent>
        <p>Some content</p>
        <button>I am a button</button>
      </ng-template>
    </sbb-expansion-panel>
  `
})
class LazyPanelWithContentComponent {
  expanded = false;
}

@Component({
  template: `
    <sbb-expansion-panel [expanded]="true">
      <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>

      <ng-template sbbExpansionPanelContent>
        <p>Some content</p>
      </ng-template>
    </sbb-expansion-panel>
  `
})
class LazyPanelOpenOnLoadComponent {}

@Component({
  template: `
    <sbb-expansion-panel [(expanded)]="expanded">
      <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>
    </sbb-expansion-panel>
  `
})
class PanelWithTwoWayBindingComponent {
  expanded = false;
}

describe('ExpansionPanelComponent', () => {
  let originalTimeout: number;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AccordionModule],
      declarations: [
        PanelWithContentComponent,
        PanelWithContentInNgIfComponent,
        PanelWithCustomMarginComponent,
        LazyPanelWithContentComponent,
        LazyPanelOpenOnLoadComponent,
        PanelWithTwoWayBindingComponent
      ]
    }).compileComponents();
  }));

  it('should expand and collapse the panel', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.detectChanges();

    const contentEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-content');
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    expect(headerEl.classList).not.toContain('sbb-expanded');
    expect(contentEl.classList).not.toContain('sbb-expanded');

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    flush();

    expect(headerEl.classList).toContain('sbb-expanded');
    expect(contentEl.classList).toContain('sbb-expanded');
  }));

  it('should be able to render panel content lazily', fakeAsync(() => {
    const fixture = TestBed.createComponent(LazyPanelWithContentComponent);
    const content = fixture.debugElement.query(By.css('.sbb-expansion-panel-content'))
      .nativeElement;
    fixture.detectChanges();

    expect(content.textContent.trim()).toBe('', 'Expected content element to be empty.');

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();

    expect(content.textContent.trim()).toContain(
      'Some content',
      'Expected content to be rendered.'
    );
  }));

  it('should render the content for a lazy-loaded panel that is opened on init', fakeAsync(() => {
    const fixture = TestBed.createComponent(LazyPanelOpenOnLoadComponent);
    const content = fixture.debugElement.query(By.css('.sbb-expansion-panel-content'))
      .nativeElement;
    fixture.detectChanges();

    expect(content.textContent.trim()).toContain(
      'Some content',
      'Expected content to be rendered.'
    );
  }));

  it('emit correct events for change in panel expanded state', () => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    expect(fixture.componentInstance.openCallback).toHaveBeenCalled();

    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    expect(fixture.componentInstance.closeCallback).toHaveBeenCalled();
  });

  it('should create a unique panel id for each panel', () => {
    const fixtureOne = TestBed.createComponent(PanelWithContentComponent);
    fixtureOne.detectChanges();

    const headerElOne = fixtureOne.nativeElement.querySelector('.sbb-expansion-panel-header');

    const fixtureTwo = TestBed.createComponent(PanelWithContentComponent);
    fixtureTwo.detectChanges();

    const headerElTwo = fixtureTwo.nativeElement.querySelector('.sbb-expansion-panel-header');

    const panelIdOne = headerElOne.getAttribute('aria-controls');
    const panelIdTwo = headerElTwo.getAttribute('aria-controls');
    expect(panelIdOne).not.toBe(panelIdTwo);
  });

  it('should set `aria-labelledby` of the content to the header id', () => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.detectChanges();

    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');
    const contentEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-content');

    const headerId = headerEl.getAttribute('id');
    const contentLabel = contentEl.getAttribute('aria-labelledby');

    expect(headerId).toBeTruthy();
    expect(contentLabel).toBeTruthy();
    expect(headerId).toBe(contentLabel);
  });

  it('should set the proper role on the content element', () => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    const contentEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-content');

    expect(contentEl.getAttribute('role')).toBe('region');
  });

  it('should toggle the panel when pressing SPACE on the header', () => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.detectChanges();

    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    spyOn(fixture.componentInstance.panel, 'toggle');

    const event = dispatchKeyboardEvent(headerEl, 'keydown', SPACE);
    fixture.detectChanges();

    expect(fixture.componentInstance.panel.toggle).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it('should toggle the panel when pressing ENTER on the header', () => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.detectChanges();

    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    spyOn(fixture.componentInstance.panel, 'toggle');

    const event = dispatchKeyboardEvent(headerEl, 'keydown', ENTER);
    fixture.detectChanges();

    expect(fixture.componentInstance.panel.toggle).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not be able to focus content while closed', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    button.focus();
    expect(document.activeElement).toBe(button, 'Expected button to start off focusable.');

    button.blur();
    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    tick(250);

    button.focus();
    expect(document.activeElement).not.toBe(button, 'Expected button to no longer be focusable.');
  }));

  it('should restore focus to header if focused element is inside panel on close', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    const header = fixture.debugElement.query(By.css('sbb-expansion-panel-header')).nativeElement;

    button.focus();
    expect(document.activeElement).toBe(button, 'Expected button to start off focusable.');

    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    tick(250);

    expect(document.activeElement).toBe(header, 'Expected header to be focused.');
  }));

  it('should be able to hide the toggle', () => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.sbb-no-toggle'))).toBeFalsy(
      'Expected indicator to be shown.'
    );

    fixture.componentInstance.hideToggle = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.sbb-no-toggle'))).toBeTruthy(
      'Expected indicator to be hidden.'
    );
  });

  it('should make sure accordion item runs ngOnDestroy when expansion panel is destroyed', () => {
    const fixture = TestBed.createComponent(PanelWithContentInNgIfComponent);
    fixture.detectChanges();
    let destroyedOk = false;
    fixture.componentInstance.panel.destroyed.subscribe(() => (destroyedOk = true));
    fixture.componentInstance.expansionShown = false;
    fixture.detectChanges();
    expect(destroyedOk).toBe(true);
  });

  it('should support two-way binding of the `expanded` property', () => {
    const fixture = TestBed.createComponent(PanelWithTwoWayBindingComponent);
    const header = fixture.debugElement.query(By.css('sbb-expansion-panel-header')).nativeElement;

    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toBe(false);

    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toBe(true);

    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toBe(false);
  });

  it('should not set the sbb-expanded class until the open animation is done', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContentComponent);
    const contentEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-content');

    fixture.detectChanges();
    expect(contentEl.classList).not.toContain(
      'sbb-expanded',
      'Expected class not to be there on init'
    );

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    expect(contentEl.classList).not.toContain(
      'sbb-expanded',
      'Expected class not to be added immediately after becoming expanded'
    );

    flush();
    expect(contentEl.classList).toContain(
      'sbb-expanded',
      'Expected class to be added after the animation has finished'
    );
  }));

  describe('disabled state', () => {
    let fixture: ComponentFixture<PanelWithContentComponent>;
    let panel: HTMLElement;
    let header: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(PanelWithContentComponent);
      fixture.detectChanges();
      panel = fixture.debugElement.query(By.css('sbb-expansion-panel')).nativeElement;
      header = fixture.debugElement.query(By.css('sbb-expansion-panel-header')).nativeElement;
    });

    it('should toggle the aria-disabled attribute on the header', () => {
      expect(header.getAttribute('aria-disabled')).toBe('false');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(header.getAttribute('aria-disabled')).toBe('true');
    });

    it('should toggle the expansion indicator', () => {
      expect(panel.querySelector('.sbb-no-toggle')).toBeFalsy();

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(panel.querySelector('.sbb-no-toggle')).toBeTruthy();
    });

    it('should not be able to toggle the panel via a user action if disabled', () => {
      expect(fixture.componentInstance.panel.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      header.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.panel.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');
    });

    it('should be able to toggle a disabled expansion panel programmatically', () => {
      expect(fixture.componentInstance.panel.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      fixture.componentInstance.expanded = true;
      fixture.detectChanges();

      expect(fixture.componentInstance.panel.expanded).toBe(true);
      expect(header.classList).toContain('sbb-expanded');
    });
  });
});
