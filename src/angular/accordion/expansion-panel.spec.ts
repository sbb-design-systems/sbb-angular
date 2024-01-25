import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
  switchToLean,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbAccordionModule, SbbExpansionPanel } from './index';

describe('SbbExpansionPanel', () => {
  let originalTimeout: number;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
    });
    TestBed.compileComponents();
  }));

  it('should expand and collapse the panel', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');
    fixture.detectChanges();

    expect(headerEl.classList).not.toContain('sbb-expanded');

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    flush();

    expect(headerEl.classList).toContain('sbb-expanded');
  }));

  it('should be able to render panel content lazily', fakeAsync(() => {
    const fixture = TestBed.createComponent(LazyPanelWithContent);
    const content = fixture.debugElement.query(
      By.css('.sbb-expansion-panel-content'),
    )!.nativeElement;
    fixture.detectChanges();

    expect(content.textContent.trim())
      .withContext('Expected content element to be empty.')
      .toBe('');

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();

    expect(content.textContent.trim())
      .withContext('Expected content to be rendered.')
      .toContain('Some content');
  }));

  it('should render the content for a lazy-loaded panel that is opened on init', fakeAsync(() => {
    const fixture = TestBed.createComponent(LazyPanelOpenOnLoad);
    const content = fixture.debugElement.query(
      By.css('.sbb-expansion-panel-content'),
    )!.nativeElement;
    fixture.detectChanges();

    expect(content.textContent.trim())
      .withContext('Expected content to be rendered.')
      .toContain('Some content');
  }));

  it('should not render lazy content from a child panel inside the parent', fakeAsync(() => {
    const fixture = TestBed.createComponent(NestedLazyPanelWithContent);
    fixture.componentInstance.parentExpanded = true;
    fixture.detectChanges();

    const parentContent: HTMLElement = fixture.nativeElement.querySelector(
      '.parent-panel .sbb-expansion-panel-content',
    );
    const childContent: HTMLElement = fixture.nativeElement.querySelector(
      '.child-panel .sbb-expansion-panel-content',
    );

    expect(parentContent.textContent!.trim()).toBe(
      'Parent content',
      'Expected only parent content to be rendered.',
    );
    expect(childContent.textContent!.trim()).toBe(
      '',
      'Expected child content element to be empty.',
    );

    fixture.componentInstance.childExpanded = true;
    fixture.detectChanges();

    expect(childContent.textContent!.trim()).toBe(
      'Child content',
      'Expected child content element to be rendered.',
    );
  }));

  it('emit correct events for change in panel expanded state', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    expect(fixture.componentInstance.openCallback).toHaveBeenCalled();

    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    expect(fixture.componentInstance.closeCallback).toHaveBeenCalled();
  });

  it('should create a unique panel id for each panel', () => {
    const fixtureOne = TestBed.createComponent(PanelWithContent);
    const headerElOne = fixtureOne.nativeElement.querySelector('.sbb-expansion-panel-header');
    const fixtureTwo = TestBed.createComponent(PanelWithContent);
    const headerElTwo = fixtureTwo.nativeElement.querySelector('.sbb-expansion-panel-header');
    fixtureOne.detectChanges();
    fixtureTwo.detectChanges();

    const panelIdOne = headerElOne.getAttribute('aria-controls');
    const panelIdTwo = headerElTwo.getAttribute('aria-controls');
    expect(panelIdOne).not.toBe(panelIdTwo);
  });

  it('should set `aria-labelledby` of the content to the header id', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');
    const contentEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-content');

    fixture.detectChanges();

    const headerId = headerEl.getAttribute('id');
    const contentLabel = contentEl.getAttribute('aria-labelledby');

    expect(headerId).toBeTruthy();
    expect(contentLabel).toBeTruthy();
    expect(headerId).toBe(contentLabel);
  });

  it('should set the proper role on the content element', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const contentEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-content');

    expect(contentEl.getAttribute('role')).toBe('region');
  });

  it('should toggle the panel when pressing SPACE on the header', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.detectChanges();
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    spyOn(fixture.componentInstance.panel, 'toggle');

    headerEl.focus();
    const event = dispatchKeyboardEvent(headerEl, 'keydown', SPACE);

    fixture.detectChanges();

    expect(fixture.componentInstance.panel.toggle).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it('should toggle the panel when pressing ENTER on the header', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.detectChanges();
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    spyOn(fixture.componentInstance.panel, 'toggle');

    headerEl.focus();
    const event = dispatchKeyboardEvent(headerEl, 'keydown', ENTER);

    fixture.detectChanges();

    expect(fixture.componentInstance.panel.toggle).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not toggle the panel when pressing ENTER on the header and activeElement is not current element', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.detectChanges();
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    spyOn(fixture.componentInstance.panel, 'toggle');

    const event = dispatchKeyboardEvent(headerEl, 'keydown', ENTER);

    fixture.detectChanges();

    expect(fixture.componentInstance.panel.toggle).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('should not toggle if a modifier key is pressed', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.detectChanges();
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');

    spyOn(fixture.componentInstance.panel, 'toggle');

    ['altKey', 'metaKey', 'shiftKey', 'ctrlKey'].forEach((modifier) => {
      const event = createKeyboardEvent('keydown', ENTER);
      Object.defineProperty(event, modifier, { get: () => true });

      dispatchEvent(headerEl, event);
      fixture.detectChanges();

      expect(fixture.componentInstance.panel.toggle).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });
  });

  it('should not be able to focus content while closed', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    const button = fixture.debugElement.query(By.css('button'))!.nativeElement;

    button.focus();
    expect(document.activeElement)
      .withContext('Expected button to start off focusable.')
      .toBe(button);

    button.blur();
    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    tick(250);

    button.focus();
    expect(document.activeElement).not.toBe(button, 'Expected button to no longer be focusable.');
  }));

  it('should restore focus to header if focused element is inside panel on close', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    const header = fixture.debugElement.query(By.css('sbb-expansion-panel-header'))!.nativeElement;

    button.focus();
    expect(document.activeElement)
      .withContext('Expected button to start off focusable.')
      .toBe(button);

    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    tick(250);

    expect(document.activeElement).withContext('Expected header to be focused.').toBe(header);
  }));

  it('should not change focus origin if origin not specified', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    tick(250);

    const header = fixture.debugElement.query(By.css('sbb-expansion-panel-header'))!;
    const headerInstance = header.componentInstance;

    headerInstance.focus('mouse');
    headerInstance.focus();
    fixture.detectChanges();
    tick(250);

    expect(header.nativeElement.classList).toContain('cdk-focused');
    expect(header.nativeElement.classList).toContain('cdk-mouse-focused');
  }));

  it('should be able to hide the toggle', () => {
    const fixture = TestBed.createComponent(PanelWithContent);
    const header = fixture.debugElement.query(By.css('.sbb-expansion-panel-header'))!.nativeElement;

    fixture.detectChanges();

    expect(header.querySelector('.sbb-expansion-panel-header-indicator'))
      .withContext('Expected indicator to be shown.')
      .toBeTruthy();

    fixture.componentInstance.hideToggle = true;
    fixture.detectChanges();

    expect(header.querySelector('.sbb-expansion-panel-header-indicator'))
      .withContext('Expected indicator to be hidden.')
      .toBeFalsy();
  });

  describe('lean', () => {
    switchToLean();

    it('should update the indicator rotation when the expanded state is toggled programmatically', fakeAsync(() => {
      const fixture = TestBed.createComponent(PanelWithContent);

      fixture.detectChanges();
      tick(250);

      const arrow = fixture.debugElement.query(
        By.css('.sbb-expansion-panel-header-indicator > sbb-icon'),
      )!.nativeElement;

      expect(arrow.style.transform)
        .withContext('Expected 90 degree rotation.')
        .toBe('rotate(90deg)');

      fixture.componentInstance.expanded = true;
      fixture.detectChanges();
      tick(250);

      expect(arrow.style.transform)
        .withContext('Expected -90 degree rotation.')
        .toBe('rotate(-90deg)');
    }));
  });

  it('should make sure accordion item runs ngOnDestroy when expansion panel is destroyed', () => {
    const fixture = TestBed.createComponent(PanelWithContentInNgIf);
    fixture.detectChanges();
    let destroyedOk = false;
    fixture.componentInstance.panel.destroyed.subscribe(() => (destroyedOk = true));
    fixture.componentInstance.expansionShown = false;
    fixture.detectChanges();
    expect(destroyedOk).toBe(true);
  });

  it('should support two-way binding of the `expanded` property', () => {
    const fixture = TestBed.createComponent(PanelWithTwoWayBinding);
    const header = fixture.debugElement.query(By.css('sbb-expansion-panel-header'))!.nativeElement;

    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toBe(false);

    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toBe(true);

    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded).toBe(false);
  });

  it('should emit events for body expanding and collapsing animations', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithContent);
    fixture.detectChanges();
    let afterExpand = 0;
    let afterCollapse = 0;
    fixture.componentInstance.panel.afterExpand.subscribe(() => afterExpand++);
    fixture.componentInstance.panel.afterCollapse.subscribe(() => afterCollapse++);

    fixture.componentInstance.expanded = true;
    fixture.detectChanges();
    flush();
    expect(afterExpand).toBe(1);
    expect(afterCollapse).toBe(0);

    fixture.componentInstance.expanded = false;
    fixture.detectChanges();
    flush();
    expect(afterExpand).toBe(1);
    expect(afterCollapse).toBe(1);
  }));

  it('should be able to set a custom tabindex on the header', fakeAsync(() => {
    const fixture = TestBed.createComponent(PanelWithHeaderTabindex);
    const headerEl = fixture.nativeElement.querySelector('.sbb-expansion-panel-header');
    fixture.detectChanges();

    expect(headerEl.getAttribute('tabindex')).toBe('7');
  }));

  describe('disabled state', () => {
    let fixture: ComponentFixture<PanelWithContent>;
    let panel: HTMLElement;
    let header: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(PanelWithContent);
      fixture.detectChanges();
      panel = fixture.debugElement.query(By.css('sbb-expansion-panel'))!.nativeElement;
      header = fixture.debugElement.query(By.css('sbb-expansion-panel-header'))!.nativeElement;
    });

    it('should toggle the aria-disabled attribute on the header', () => {
      expect(header.getAttribute('aria-disabled')).toBe('false');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(header.getAttribute('aria-disabled')).toBe('true');
    });

    it('should toggle the expansion indicator', () => {
      expect(panel.querySelector('.sbb-expansion-panel-header-indicator')).toBeTruthy();

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(panel.querySelector('.sbb-expansion-panel-header-indicator')).toBeFalsy();
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

    it('should be able to toggle a disabled expansion panel programmatically via the open/close methods', () => {
      const panelInstance = fixture.componentInstance.panel;

      expect(panelInstance.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      panelInstance.open();
      fixture.detectChanges();

      expect(panelInstance.expanded).toBe(true);
      expect(header.classList).toContain('sbb-expanded');

      panelInstance.close();
      fixture.detectChanges();

      expect(panelInstance.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');
    });

    it('should be able to toggle a disabled expansion panel programmatically via the toggle method', () => {
      const panelInstance = fixture.componentInstance.panel;

      expect(panelInstance.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      panelInstance.toggle();
      fixture.detectChanges();

      expect(panelInstance.expanded).toBe(true);
      expect(header.classList).toContain('sbb-expanded');

      panelInstance.toggle();
      fixture.detectChanges();

      expect(panelInstance.expanded).toBe(false);
      expect(header.classList).not.toContain('sbb-expanded');
    });

    it('should update the tabindex if the header becomes disabled', () => {
      expect(header.getAttribute('tabindex')).toBe('0');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(header.getAttribute('tabindex')).toBe('-1');
    });
  });
});

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
  `,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class PanelWithContent {
  expanded = false;
  hideToggle = false;
  disabled = false;
  openCallback = jasmine.createSpy('openCallback');
  closeCallback = jasmine.createSpy('closeCallback');
  @ViewChild(SbbExpansionPanel) panel: SbbExpansionPanel;
}

@Component({
  template: `
    @if (expansionShown) {
      <sbb-expansion-panel>
        <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>
      </sbb-expansion-panel>
    }
  `,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class PanelWithContentInNgIf {
  expansionShown = true;
  @ViewChild(SbbExpansionPanel)
  panel: SbbExpansionPanel;
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
  `,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class LazyPanelWithContent {
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
  `,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class LazyPanelOpenOnLoad {}

@Component({
  template: `
    <sbb-expansion-panel [(expanded)]="expanded">
      <sbb-expansion-panel-header>Panel Title</sbb-expansion-panel-header>
    </sbb-expansion-panel>
  `,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class PanelWithTwoWayBinding {
  expanded = false;
}

@Component({
  template: `<sbb-expansion-panel>
    <sbb-expansion-panel-header tabindex="7">Panel Title</sbb-expansion-panel-header>
  </sbb-expansion-panel>`,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class PanelWithHeaderTabindex {}

@Component({
  template: `
    <sbb-expansion-panel class="parent-panel" [expanded]="parentExpanded">
      Parent content
      <sbb-expansion-panel class="child-panel" [expanded]="childExpanded">
        <ng-template sbbExpansionPanelContent>Child content</ng-template>
      </sbb-expansion-panel>
    </sbb-expansion-panel>
  `,
  standalone: true,
  imports: [SbbAccordionModule, SbbIconTestingModule],
})
class NestedLazyPanelWithContent {
  parentExpanded = false;
  childExpanded = false;
}
